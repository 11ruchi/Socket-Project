function sendMessage(event, socket) {
	event.preventDefault();
	let chatContainer = document.getElementById('chatContainer');
	let message = document.getElementById('message').value;
	let username = document.getElementById('username').value;
	let channel = document.getElementById('channel').value;
	let chatError = document.getElementById('chatError');
	if (chatError != null) {
		chatError.innerHTML = '';
		if (channel == '') {
			chatError.appendChild(createErrorLabel('Please select the channel'));
			chatError.style.display = "block";
			return;
		}
		if (message == '') {
			chatError.appendChild(createErrorLabel('Please enter the message'));
			chatError.style.display = "block";
			return;
		}
		chatError.style.display = "none";
	}
	var div = document.createElement('div');
	div.classList.add('col-12', 'message');
	div.innerHTML = `	
				<div class="card alert-warning">
					<div class="card-body">
						<p class="card-text">Me : ${message}</p>
					</div>
				</div>
			 `;

	let channelMessage = {};
	channelMessage.message = message;
	channelMessage.channel = channel;
	channelMessage.username = username;
	socket.emit('message', channelMessage);
	chatContainer.insertBefore(div, chatContainer.childNodes[0]);
	document.getElementById('message').value ='';
}

function createErrorLabel(message) {
	let label = document.createElement('label');
	let text = document.createTextNode(message);
	label.appendChild(text);
	return label
}

function joinChannel(event, socket) {
	event.preventDefault();
	let channelsInpt = document.getElementById('newchannel').value;
	let channelMessage = {};
	channelMessage.channel = channelsInpt;
	socket.emit('joinChannel', channelMessage);

}

function leaveChannel(event, socket) {
	event.preventDefault();
	let channelsInpt = document.getElementById('newchannel').value;
	let channelMessage = {};
	channelMessage.channel = channelsInpt;
	socket.emit('leaveChannel', channelMessage);
}

function onWelcomeMessageReceived(message) {
	let chatContainer = document.getElementById('chatContainer');
	var div = document.createElement('div');
	div.classList.add('col-12', 'message');
	div.innerHTML = `
				<div class="card alert-primary">
					<div class="card-body">
						<p class="card-text">System : ${message}</p>
					</div>
				</div>
			`;
	chatContainer.insertBefore(div, chatContainer.childNodes[0]);

}

function onNewMessageReceived(message) {
	let chatContainer = document.getElementById('chatContainer');
	var div = document.createElement('div');
	div.classList.add('col-12', 'message');
	div.innerHTML = `
				<div class="card alert-success">
					<div class="card-body">
						<p class="card-text">${message.username} : ${message.message}</p>
					</div>
				</div>
			`
	chatContainer.insertBefore(div, chatContainer.childNodes[0]);
}

function onAddedToNewChannelReceived(message) {
	if (message.channel.length > 0) {
		let divMessage = `You are added to <strong>${message.channel}</strong> successfully!`;
		buildChannelsHTML(message, true, divMessage);
	}

}

function onRemovedFromChannelReceived(message) {
	let divMessage = `You are removed from <strong>${message.channel}</strong> successfully!`;
	buildChannelsHTML(message, false, divMessage);


}

function buildChannelsHTML(message, isAdd, divMessage) {
	let div = document.createElement('div');
	let alertStyle = 'alert-danger';
	if (isAdd) {
		alertStyle = 'alert-success';
	}
	let att = document.createAttribute("role");
	att.value = "alert";
	div.setAttributeNode(att);
	div.classList.add('alert', 'alert-success', 'alert-dismissible', 'fade', 'show', alertStyle);
	div.innerHTML = `
	<div >`+ divMessage + `		
			<button type="button" class="close" data-dismiss="alert" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
	</div>`;
	let alertCont = document.getElementById('alertContainer');
	alertCont.appendChild(div);
	if (message.channel != '') {

		let channeList = document.getElementById('channelsList');
		let options = '';

		if (Array.isArray(message.channel)) {
			channeList.innerHTML = '';
			message.channel.map(function (value) {
				options += `<option>${value}</option>`;
			});
			channeList.innerHTML = options;
		} else {

			if (isAdd) {
				var option = document.createElement('option');
				option.value = message.channel;
				channeList.appendChild(option);
			} else {
				remSelOpt(message.channel, channeList);
			}
		}
		document.getElementById('newchannel').value = '';
	}

}


function remSelOpt(val, channeList) {
	let len = channeList.options.length;
	for (i = 0; i < len; i++) {
		if (channeList.options[i].value == val) {
			channeList.children[i].remove();
			break;
		}
	}
}


module.exports = {
	sendMessage,
	joinChannel,
	leaveChannel,
	onWelcomeMessageReceived,
	onNewMessageReceived,
	onAddedToNewChannelReceived,
	onRemovedFromChannelReceived
};

// You will get error - Uncaught ReferenceError: module is not defined
// while running this script on browser which you shall ignore
// as this is required for testing purposes and shall not hinder
// it's normal execution

