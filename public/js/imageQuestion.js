const quesForm = async (data) => {
   try {
     var form = new Array();
     data.forEach(function(g){
        form.push(g);
     });
     console.log(form);
     const result = await axios({
       method: "POST",
       url: `/questionsImage`,
       headers: {
         'Content-Type': 'multipart/form-data'
       },
       data: form[0]
     });
     const option1 = await axios({
      method: "POST",
      url: `/option1Image`,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: form1[0]
    });
   //   location.assign('/login');
   } catch (err) {
     console.log(err);
   }
 };
 
 
 