const option3Form = async (data) => {
    try {
      var form = new Array();
      data.forEach(function(g){
         form.push(g);
      });
      console.log(form);
      const result = await axios({
        method: "POST",
        url: `/option3Image`,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: form[0]
      });
     
    //   location.assign('/login');
    } catch (err) {
      console.log(err);
    }
  };
  
  
  