/*var input = document.querySelector('input[type="file"]')

var data = new FormData()
data.append('file', input.files[0])
data.append('user', 'hubot')

fetch('/upload', {
  method: 'POST',
  body: data
})*/

/*document.querySelector('#addFile').addEventListener('click', ()=>{
    let html=document.querySelector('.fileBlock').outerHTML;
    document.querySelector('#filesContainer').innerHTML+=html;
});
document.querySelector('#removeFile').addEventListener('click', ()=>{
    let blocks=document.querySelectorAll('.fileBlock');
    if(blocks.length<=1)
        return;
    blocks[blocks.length-1].remove();
});*/
document.querySelector('#submitFiles').addEventListener('click', ()=>{
    let data = new FormData();
    /*let inputs=Array.from(document.querySelectorAll('.fileItem'));
    let descs=Array.from(document.querySelectorAll('.description'));*/
    let input=document.querySelector('.fileItem');
    let textareas=Array.from(document.querySelectorAll('.customArea'));
    
    if(!input.files[0]){
        alert('Upload file please!');
        return;
    }
    data.append('file', input.files[0]);
    textareas.forEach((x,i)=>data.append(`descs[${x.getAttribute('data-name')}]`, x.value));
    //inputs.forEach((x,i)=>data.append('file_'+i, x.files[0]));
    //descs.forEach((x,i)=>data.append('desc_'+i, x.value));
    fetch('/upload', {
        method: 'POST',
        body: data
    }).then(x=>x.json()).then(x=>{
        console.log(x);
    });
});
document.querySelector('.fileItem').onchange=function(){
    document.querySelector('#outputImg').innerText=this.files[0].name;
};
Array.from(document.querySelectorAll('.customArea')).forEach(x=>x.value=x.getAttribute('data-name'));