$(document).ready(function(){
    $.getJSON("http://localhost:3000/flight/fetchcities",function(data){
       data.result.map((item)=>{
        $('#sourcecity').append($('<option>').text(item.cityname).val(item.cityid))
        $('#destcity').append($('<option>').text(item.cityname).val(item.cityid))  
       })   
    })
})