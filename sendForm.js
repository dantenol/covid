async function enviarForm(id, data, nextUrl) {
  const formData = new FormData();
  for (var key in data) {
    formData.append(key, data[key]);
  }

  try {
    const res = await fetch(
      "https://docs.google.com/forms/d/e/" + id + "/formResponse",
      {
        method: "POST",
        mode: "no-cors",
        body: formData
      }
    );
   window.location.href = nextUrl;
   console.log(res);
  } catch (error) {
    console.log(error);
  }
}

async function enviarForm2(id, data, nextUrl) {
  const formData = new FormData();
  for (var key in data) {
    if(Array.isArray(data[key])){
      data[key].forEach(function(entry) {
        formData.append(key, entry);
    });
    }else{
        formData.append(key, data[key]);
    }
  }
  try {
    const res = await fetch(
      "https://docs.google.com/forms/d/e/" + id + "/formResponse",
      {
        method: "POST",
        mode: "no-cors",
        body: formData
      }
    );
    window.location.href = nextUrl;
  } catch (error) {
    console.log(error);
  }
}
