async function uploadFile(){

const fileInput = document.getElementById("fileInput");

if(!fileInput.files.length){
alert("Please select file");
return;
}

const formData = new FormData();
formData.append("file", fileInput.files[0]);

document.getElementById("result").innerHTML = "Analyzing...";

const res = await fetch("/detect",{
method:"POST",
body:formData
});

const data = await res.json();

document.getElementById("result").innerHTML = `
<h3>Detection Report</h3>

AI Generated Probability: ${data.ai_generated}% <br>
Real Probability: ${data.real}% <br><br>

Score: ${data.ai_generated}/100
`;
}