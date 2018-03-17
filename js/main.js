var list=['blah', 'yah', 'boo'];
var i=0;
/* const toggle_text = function () {
  document.getElementById('.cf_para1').innerHTML = list[i%3];
  i++;
} */
document.getElementById('toggle_button').addEventListener("click", function(){document.getElementById('cf_para1').innerHTML = list[(i++)%3];}); //