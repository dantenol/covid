'use strict';
const moment = require('moment');

module.exports = function(Psyrequest) {
  Psyrequest.disableRemoteMethodByName('prototype.__destroy__psyDetails');
  Psyrequest.disableRemoteMethodByName('prototype.__create__psyDetails');
  Psyrequest.disableRemoteMethodByName('prototype.__update__psyDetails');
  Psyrequest.disableRemoteMethodByName('prototype.__get__psyDetails');

  Psyrequest.form = async data => {
    const Person = Psyrequest.app.models.Person;
    const Psydetails = Psyrequest.app.models.PsyDetails;
    const {form, personInfo} = data;

    const personData = await Person.create({
      ...personInfo,
      createdAt: new Date(),
    });

    const requestData = await Psyrequest.create({
      ...form,
      createdAt: new Date(),
      personId: personData.id,
    });

    const detailsData = await Psydetails.create({
      urgency: form.domesticViolence ? 3 : 1,
      modifiedAt: new Date(),
      psyRequestId: requestData.id,
    });

    return {requestData, personData};
  };

  Psyrequest.remoteMethod('form', {
    accepts: [
      {arg: 'data', type: 'object', http: {source: 'body'}, required: true},
    ],
    description: 'Answer form',
    returns: {root: true},
    http: {path: '/formAnswer', verb: 'post'},
  });

  Psyrequest.listPatients = async filters => {
    const psyDetails = Psyrequest.app.models.PsyDetails;
    let query = {};
    if (filters) {
      query = {status: {inq: filters}};
    }
    const patients = psyDetails.find({
      where: query,
      fields: ['status', 'urgency', 'psyRequestId', 'psychologistId'],
      include: {
        relation: 'psyRequest',
        scope: {
          include: {
            relation: 'person',
            scope: {
              fields: ['name', 'phone'],
              include: {
                relation: 'psySchedules',
                where: {done: false},
              },
            },
          },
        },
      },
    });

    return patients;
  };

  Psyrequest.remoteMethod('listPatients', {
    accepts: [{arg: 'filters', type: 'array', required: false}],
    description: 'List psychological patients',
    returns: {root: true},
    http: {path: '/list', verb: 'get'},
  });

  function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
  }

  const objRel = {
    pending: 'nova entrada',
    firstContact: 'primeiro contato',
    scheduled: 'agendado',
    reschedule: 'aguardando remarcação',
    finished: 'finalizado',
    urgency: 'Urgência',
    status: 'Status',
    1: 'não urgente',
    2: 'semi-urgente',
    3: 'emergência',
    psychologistId: 'Psicóloga(o)',
  };

  const findPsychologist = async id => {
    const Agent = Psyrequest.app.models.Agent;
    if (!id) {
      return 'nenhum';
    }

    const psy = await Agent.findById(id);
    return psy.toJSON().fullName;
  };

  Psyrequest.updateStatusUrgency = async (id, data, req) => {
    const Person = Psyrequest.app.models.Person;
    const Agent = Psyrequest.app.models.Agent;
    const PsyDetails = Psyrequest.app.models.PsyDetails;
    const Log = Psyrequest.app.models.Log;
    const val = Object.keys(data);
    const allowedProps = ['urgency', 'status', 'psychologistId'];
    if (val.length > 1 || !allowedProps.includes(val[0])) {
      throw 'Invalid data';
    }

    const key = val[0];
    const value = data[key];

    data.modifiedAt = new Date();

    const pat = await Person.findById(id, {
      include: {
        relation: 'psyRequests',
        scope: {
          include: 'psyDetails',
        },
      },
    });
    const details = await PsyDetails.findById(
      pat.toJSON().psyRequests.psyDetails.id,
    );

    const change = await details.updateAttributes(data);
    const agent = await Agent.findById(req.accessToken.userId);
    let changedValue;

    if (key === 'psychologistId') {
      changedValue = await findPsychologist(value);
    }

    await Log.create({
      message: `${objRel[key]} alterado para ${changedValue || objRel[value]}`,
      createdBy: agent.fullName,
      timestamp: new Date(),
      personId: pat.id,
    });

    return change;
  };

  Psyrequest.remoteMethod('updateStatusUrgency', {
    accepts: [
      {arg: 'id', type: 'string', required: true},
      {arg: 'data', type: 'object', http: {source: 'body'}, required: true},
      {arg: 'req', type: 'object', http: {source: 'req'}},
    ],
    description: 'update psychological managment state',
    returns: {root: true},
    http: {path: '/:id/updateState', verb: 'patch'},
  });

  Psyrequest.listLogs = async personId => {
    const Person = Psyrequest.app.models.Person;

    const logs = await Person.findById(personId, {
      include: {
        relation: 'logs',
        scope: {
          order: 'timestamp DESC',
        },
      },
    });
    return logs.toJSON().logs;
  };

  Psyrequest.remoteMethod('listLogs', {
    accepts: [{arg: 'personId', type: 'string', required: true}],
    description: 'get patient logs',
    returns: {root: true},
    http: {path: '/:personId/logs', verb: 'get'},
  });

  Psyrequest.addLog = async (req, personId, message) => {
    const Agent = Psyrequest.app.models.Agent;
    const Log = Psyrequest.app.models.Log;

    const agent = await Agent.findById(req.accessToken.userId);
    const log = await Log.create({
      message,
      createdBy: agent.fullName,
      timestamp: new Date(),
      personId: personId,
      isManual: true,
    });

    return log;
  };

  Psyrequest.remoteMethod('addLog', {
    accepts: [
      {arg: 'req', type: 'object', http: {source: 'req'}},
      {arg: 'personId', type: 'string', required: true},
      {arg: 'message', type: 'string', required: true},
    ],
    description: 'add manual log',
    returns: {root: true},
    http: {path: '/:personId/log', verb: 'post'},
  });

  Psyrequest.newAppointment = async (req, data) => {
    const PsySchedule = Psyrequest.app.models.PsySchedule;
    const Log = Psyrequest.app.models.Log;
    const Agent = Psyrequest.app.models.Agent;
    const PsyRequest = Psyrequest.app.models.PsyRequest;

    const appointment = PsySchedule.create({
      ...data,
      createdAt: new Date(),
    });

    const reqId = data.request;
    delete data.request;

    const psyName = await findPsychologist(data.psychologistId);
    const agent = await Agent.findById(req.accessToken.userId);

    await Log.create({
      message: `Atendimento com ${psyName} agendado para ${moment(
        data.scheduled,
      ).format('D/M/YY [às] HH:mm')}.`,
      createdBy: agent.fullName,
      timestamp: new Date(),
      personId: data.personId,
    });

    const details = await PsyRequest.findById(reqId, {
      include: 'psyDetails',
    });

    console.log(details.psyDetails);
    details.psyDetails.update({status: 'scheduled'});

    return appointment;
  };

  Psyrequest.remoteMethod('newAppointment', {
    accepts: [
      {arg: 'req', type: 'object', http: {source: 'req'}},
      {arg: 'data', type: 'object', http: {source: 'body'}},
    ],
    description: 'Schedule psychological consultation',
    returns: {root: true},
    http: {path: '/schedule', verb: 'post'},
  });
};
