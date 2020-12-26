const registerForm = async (data) => {
   try {
     var form = new Array();
     data.forEach(function(g){
        form.push(g);
     });
     const result = await axios({
       method: "POST",
       url: `/register/alagalagkarkedekhomilegainformation${form[0]}alagalagkarkedekhomilegainformation${form[1]}alagalagkarkedekhomilegainformation${form[2]}alagalagkarkedekhomilegainformation${form[3]}alagalagkarkedekhomilegainformation${form[4]}alagalagkarkedekhomilegainformation${form[5]}`,
       headers: {
         'Content-Type': 'multipart/form-data'
       },
       data: form[6]
     });
     location.assign('/login');
   } catch (err) {
     console.log(err);
   }
 };
 
 
 