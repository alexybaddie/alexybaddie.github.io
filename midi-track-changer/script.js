import * as midiManager from 'midi-file';

var parseMidi = require('midi-file').parseMidi;
var writeMidi = require('midi-file').writeMidi;

let midiData;

export function separateTracks(numTracksPerNote) {
    let tracks = midiData.tracks;
    let newTracks = [];
    let trackCounter = 0;
    let absoluteTime = 0;
    let trackOfHeldNotes = {};
    for (let i = 0; i < tracks.length; i++) {
        let track = tracks[i];
        for (let j = 0; j < track.length; j++) {
            let event = track[j];
            absoluteTime += event.deltaTime;
            event.absoluteTime = absoluteTime;
            var trackToInsert = event.type == "noteOff" ? trackOfHeldNotes[event.noteNumber] : trackCounter;
            if(event.type === 'controlChange' && (event.controllerType === 64 || event.controllerType === 66 || event.controllerType === 67)){
                trackToInsert = 7;
            }

            if (!newTracks[trackToInsert]) {
                newTracks[trackToInsert] = [];
                event.deltaTime = absoluteTime;
            } else {
                event.deltaTime = absoluteTime - newTracks[trackToInsert].at(-1).absoluteTime;
            }
            newTracks[trackToInsert].push(event);
            if (event.type === "noteOn") {
                trackOfHeldNotes[event.noteNumber] = trackCounter;
                trackCounter++;
                if (trackCounter === numTracksPerNote) {
                    trackCounter = 0;
                }
            }
        }
    }
    midiData.tracks = newTracks;
}

// choose the file
export function chooseFile() {
  let fileInput = document.getElementById("file-input");
  fileInput.click();
  document.getElementById("upload-button").disabled = false;
}

// process the file
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
    midiData = parseMidi(content);
    //you can process the tracks as explained before

    let tracksNumber = document.getElementById("track-number").value;
    document.getElementById("track-number").addEventListener("input", function() {
        tracksNumber = this.value;
    });
    separateTracks(parseInt(tracksNumber));

    setTimeout(function(){
      let output = document.getElementById("output");
      output.innerHTML = "File processed: " + replacename + " (Processed).mid";
      document.getElementById("download-button").disabled = !midiData;
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
  if (midiData) {
    var newMidi = writeMidi(midiData);
    var data = new Blob([new Uint8Array(writeMidi(midiData))], {type: "audio/midi"});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = replacename + " (Processed).mid";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function(){
      location.reload();
    }, 1750);
  } else {
    console.log("midiData not defined");
  }
}
