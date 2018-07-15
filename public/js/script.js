function sendMessage(event, socket) {
	event.preventDefault();
	let chatContainer = document.getElementById('chatContainer');
	let message = document.getElementById('message').value;
	chatContainer.querySelectorAll('div.sent')[0].getElementsByTagName('p')[0].innerHTML = 'Me : ' + message;
	socket.emit('message',message);
	$('#sentMessage').show();
}

function joinChannel(event, socket) {
	event.preventDefault();
	let channelsInpt = document.getElementById('newchannel').value;
	let channel = channelsInpt === '' ? [] : channelsInpt.split(',');
	console.log("add channel",channel);
	socket.emit('joinChannel', channel);

}

function leaveChannel(event, socket) {
	event.preventDefault();
	let channelsInpt = document.getElementById('newchannel').value;
	let channel = channelsInpt === '' ? [] : channelsInpt.split(',');

	// let channeList = document.getElementById('channelsList');
	// console.log(channeList.selectedIndex);
	// channeList.remove(channeList.selectedIndex);
	// document.getElementById('newchannel').value = '';
	// console.log('channeList', channeList);
	socket.emit('leaveChannel', channel);
}

function onWelcomeMessageReceived(message) {
	console.log('message', message);
	let chatContainer = document.getElementById('chatContainer');
	chatContainer.querySelectorAll('div.system')[0].getElementsByTagName('p')[0].innerHTML = 'System : Welcome ' + message.username + '!!';
	$('#systemMessage').show();

}

function onNewMessageReceived() {
}

function onAddedToNewChannelReceived(message) {
	buildChannelsHTML(message, 'You are added to <strong>' + message + '</strong> successfully!');
}

function onRemovedFromChannelReceived(message) {

	buildChannelsHTML(message, 'You are removed from <strong>' + message + '</strong> successfully!');


}

function buildChannelsHTML(message, textMessage) {
	$('#channelAlert').show();
	document.getElementById('channelAlert').innerText = textMessage;
	if (message != '' && message.length > 0) {
		console.log('aaa', message);
		let channeList = document.getElementById('channelsList');
		let options;
		message.map(function (channel) {
			options += `
			<option>${channel}</option>
			` ;
		});
		console.log(options);
		channeList.innerHTML = options;
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

