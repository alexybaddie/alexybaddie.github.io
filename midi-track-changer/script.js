import * as midiManager from 'midi-file';

var parseMidi = require('midi-file').parseMidi;
var writeMidi = require('midi-file').writeMidi;

// choose the file
export function chooseFile() {
  let fileInput = document.getElementById("file-input");
  fileInput.click();
  document.getElementById("upload-button").disabled = false;
}

// process the file
let tracks;

export function processMIDI() {
  let fileInput = document.getElementById("file-input");
  let file = fileInput.files[0];
  let fileName = document.getElementById("file-name");
  fileName.innerHTML = "Selected file: " + file.name;
  var reader = new FileReader();
	reader.readAsArrayBuffer(file);
	window.file = file;

	reader.onload = readerEvent => {
		var content = new Uint8Array(readerEvent.target.result);
		var midiData = parseMidi(content);
  };
}

// upload the file
export function uploadFile() {
  let fileInput = document.getElementById("file-input");
  let file = fileInput.files[0];
  var replacename = file.name.replace('.mid', '');
  let reader = new FileReader();
  let progressBar = document.getElementById("progress-bar");
  reader.onloadstart = function() {
    progressBar.style.width = "0%";
  }
  reader.onload = readerEvent => {
    var content = new Uint8Array(readerEvent.target.result);
    var midiData = parseMidi(content);
    //you can process the tracks as explained before
    setTimeout(function(){
      let output = document.getElementById("output");
      output.innerHTML = "File processed: " + replacename + " (Colorized).mid";
    }, 350);

  }
  reader.onprogress = function(e) {
    let progress = Math.round((e.loaded / e.total) * 100);
    progressBar.style.width = progress + "%";
  }
  reader.onloadend = function() {
    progressBar.style.width = "100%";
  }
  reader.readAsArrayBuffer(file);
}

// download the file
export function downloadFile() {
  let fileInput = document.getElementById("file-input");
  let file = fileInput.files[0];
  var replacename = file.name.replace('.mid', '');
  if (tracks) {
    let processedMIDI = new MidiWriter.Writer();
    tracks.forEach(track => {
        processedMIDI.addTrack(track);
    });
    processedMIDI = processedMIDI.buildFile();
    var data = new Blob([processedMIDI], {type: 'audio/midi'});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = replacename + " (Colorized).mid";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    console.log("tracks not defined");
  }
}
