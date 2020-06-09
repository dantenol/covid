'use strict';

module.exports = function(Agent) {
  Agent.disableRemoteMethodByName('prototype.__destroyById__psyDetails');
  Agent.disableRemoteMethodByName('prototype.__create__psyDetails');
  Agent.disableRemoteMethodByName('prototype.__updateById__psyDetails');
  Agent.disableRemoteMethodByName('prototype.__get__psyDetails');
  Agent.disableRemoteMethodByName('prototype.__findById__psyDetails');
  Agent.disableRemoteMethodByName('prototype.__delete__psyDetails');
  Agent.disableRemoteMethodByName('prototype.__count__psyDetails');

  Agent.beforeRemote('login', (ctx, data, next) => {
    const body = ctx.req.body;
    body.ttl = 31540000;
    next();
  });

  Agent.beforeRemote('create', (ctx, data, next) => {
    const body = ctx.req.body;
    body.createdAt = new Date();
    if (body.role === 'psychologist') {
      body.availability = {
        segunda: [],
        terca: [],
        quarta: [],
        quinta: [],
        sexta: [],
        sabado: [],
        domingo: [],
      };
    }
    next();
  });

  Agent.listPsychologists = async () => {
    return await Agent.find({
      where: {role: 'psychologist'},
      fields: ['fullName', 'id', 'availability'],
    });
  };

  Agent.remoteMethod('listPsychologists', {
    description: 'list all psychologists',
    returns: {root: true},
    http: {path: '/psychologists', verb: 'get'},
  });

  Agent.updateAvailability = async (id, data) => {
    const usr = await Agent.findById(id);
    const obj = usr.toJSON();

    const newHours = {...obj.availability, ...data};

    return await usr.updateAttributes({availability: newHours});
  };

  Agent.remoteMethod('updateAvailability', {
    accepts: [
      {arg: 'id', type: 'string', required: true},
      {arg: 'data', type: 'object', http: {source: 'body'}, required: true},
    ],
    description: 'update availability',
    returns: {root: true},
    http: {path: '/:id/availability', verb: 'patch'},
  });
};
