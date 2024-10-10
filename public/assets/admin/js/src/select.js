
export default function(){
  // console.log('select');
  var checkAllControl = document.querySelector('.check-all');
  if(!checkAllControl) return;
  
  checkAllControl.addEventListener('click', function (){
    var inputCheckbox = document.querySelectorAll('input[name="ids"]');
    for(var i=0; i<inputCheckbox.length; i++){
      inputCheckbox[i].checked = checkAllControl.checked ? true : false;
    }
  });
  

  
  // console.log(inputCheckbox);
}




