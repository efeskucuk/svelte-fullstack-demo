<style>
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video,textarea {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
	border-radius: 0;
	font-family: sans-serif;
}

div.main {
	background:#949CA9;
	position:relative;
	height:100%;
	width:100%;
}

div .container {
	display:flex;
	flex-direction: column;
	position: absolute;
  width:80%;
  left:10%;
  height:96%;
  top:2%;
	background:#f5f2ed;
	-webkit-box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.25);
	-moz-box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.25);
	box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.25);
}

textarea {
	background:transparent;
	width:100%;
	height:100%;
	padding:15px;
	color: black;
	resize: none;
	font-weight: lighter;
}

.readonly {
	color:red;
}

button {
	position:relative;
	display:inline-block;
	margin:15px;
	float:right;
	width:70px;
	height:40px;
	color:white;
	background-color:#949CA9;
	border:0;
	border-radius:2px;
	transition:all 0.2s;
}

button:hover {
	box-shadow: 0 5px 0 rgba(0, 0, 0, 0.2);
}

button:active {
	transform: translate(0px,5px);
	box-shadow: 0 0 0 rgba(0, 0, 0, 0.2);
	background:#767C86;
}

.note-footer {
	line-height: 70px;
}

div.url-pop {
	min-width: 10px;
	line-height: 39px;
	border-radius: 2px;
	border:1px solid #949CA9;
	display: inline-block;
	margin: 0 15px;
	vertical-align: middle;
	box-shadow: 0px 0px 1px 0px rgb(139, 148, 162);
	background: white;
}

.url-pop p {
	margin:0 10px;
	color: #2D2F33;
	font-weight: lighter;
	vertical-align: middle;
	-webkit-user-select: all;
  -moz-user-select: all;
  -ms-user-select: all;
  user-select: all;

}
</style>
<script>
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	let visible;
	let url = '';
	let buttonVisible = false;
	let textareaDisabled = true;
	let note = '';

	onMount(() => {
		let path = window.location.pathname.replace('/','')
		if(path && path.length === 10) {
			getNote(path);
		}
		else {
			buttonVisible = true;
			textareaDisabled = false;
		}
	});


	function getNote(noteUrl) {
		let resultCallback = (data) => {
			if (data.code === 0) {
				note = data.note;
			}
		}
		postData("http://localhost:3000/note", {"noteUrl": noteUrl}, resultCallback);

	}

	async function popUrl() {
		if (visible) {
			visible = false;
			setTimeout(()=>{visible = true;}, 500);
		}
		else {
			visible = true;
		}
	}

	function saveNote(){
		let note = document.querySelector('textarea').value;
		let resultCallback = (data) => {
			if (data.code === 0) {
				url=window.location.hostname + "/" + data.url;
				popUrl()
			}
		}
		postData("http://localhost:3000/save", {"note": note}, resultCallback);
	}

	function postData(url, data, resultCallback){
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");

		xhr.onreadystatechange = function () {
    	if (xhr.readyState === 4) {
				if (xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        resultCallback(json);
				}
				else {
					resultCallback({code:1,detail:"Unexpected server response"});
				}
    	}

		};

		var body = JSON.stringify(data);
		xhr.send(body);
	}

</script>


<div class="main">
	<div class="container">
		<div style="flex-grow:1">
			<textarea readonly={textareaDisabled}>{note}</textarea>
		</div>
		<div class="note-footer">
		{#if visible}
		<div transition:slide="{{delay: 100, duration: 300, easing: quintOut }}" class="url-pop"><p>{url}</p></div>
		{/if}
		{#if buttonVisible}
		<button type="button" on:click={saveNote}>Save!</button>
		{/if}
		</div>
	</div>
</div>
