import * as MidiFile from 'midi-file'

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
  let reader = new FileReader();
  reader.onload = function() {
    let buffer = reader.result;
    let midiFile = new MidiFile(buffer);
    let tracks = midiFile.tracks;
    tracks.forEach((track) => {
        console.log(track);
        // Do something with the track
    });
    let output = document.getElementById("output");
    output.innerHTML = "File processed: " + file.name;
    document.getElementById("download-button").disabled = !tracks;
  }
  reader.readAsArrayBuffer(file);
}

// upload the file
export function uploadFile() {
  let fileInput = document.getElementById("file-input");
  let file = fileInput.files[0];
  let reader = new FileReader();
  let progressBar = document.getElementById("progress-bar");
  reader.onloadstart = function() {
    progressBar.style.width = "0%";
  }
  reader.onloadstart = function() {
    let midiFile = new MidiFile(reader.result);
    let tracks = midiFile.tracks;
    //you can process the tracks as explained before
    let output = document.getElementById("output");
    output.innerHTML = "File processed: " + file.name;
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
  if (tracks) {
    let processedMIDI = new MidiWriter.Writer();
    tracks.forEach(track => {
        processedMIDI.addTrack(track);
    });
    processedMIDI = processedMIDI.buildFile();
    var data = new Blob([processedMIDI], {type: 'audio/midi'});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = 'processed-midi.mid';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    console.log("tracks not defined");
  }
}
