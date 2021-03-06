import React, { useState, useEffect } from 'react';
import { Form, Button, Radio } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { AuthConsumer } from '../../providers/AuthProvider';
import { withRouter } from 'react-router-dom';
import './BoardStyles.css';

const BoardForm = (props) => {
	const [ name, setName ] = useState('');
	const [ des, setDes ] = useState('');
	const [ file, setFile ] = useState('');
	const [ pub, setPub ] = useState(false);

	const board = {
		name: name,
		description: des,
		user_id: props.auth.user.id,
		image: file,
		public: pub
	};

	useEffect(() => {
		if (!props.create) {
			setName(props.name);
			setDes(props.description);
			setPub(props.public ? props.public : false);
		}
	}, []);

	const handleDrop = (file) => {
		setFile(file[0]);
	};

	const createUserBoard = (board) => {
		axios
			.post(`/api/user_boards`, { user_id: props.auth.user.id, board_id: board.id })
			.then((res) => {
				console.log('success');
				console.log(res.data);
			})
			.catch((err) => {
				console.log('failure');
			});
	};

	const randomCode = () => {
		return Math.floor(Math.random() * 1000000);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (props.create) {
			board.code = randomCode();
			let data = new FormData();
			data.append('file', file);
			axios
				.post(
					`/api/boards?name=${board.name}&description=${board.description}&public=${board.public}&code=${board.code}`,
					data
				)
				.then((res) => {
					createUserBoard(res.data);
					props.history.push(`/board/${res.data.id}`);
				});
		}
		if (props.editBoard) {
			props.editBoard(props.id, board);
			props.toggleEdit();
		}
		if (props.editSingleBoard) {
			props.editSingleBoard(props.id, board);
			props.toggleEdit();
		}
	};

	return (
		<Form onSubmit={handleSubmit}>
			<Form.Input
				label="Name"
				name="name"
				placeholder="Name"
				value={name}
				onChange={(e) => setName(e.target.value)}
				required
			/>
			<Form.Input
				label="Description"
				name="description"
				placeholder="Description"
				value={des}
				onChange={(e) => setDes(e.target.value)}
				required
			/>
			<Dropzone onDrop={handleDrop} multiple={false}>
				{({ getRootProps, getInputProps, isDragActive }) => {
					return (
						<div {...getRootProps()} style={styles.dropzone}>
							<input {...getInputProps()} />
							{isDragActive ? (
								<p>Drop files here...</p>
							) : (
								<p>Try dropping some files here, or click to select files to upload.</p>
							)}
						</div>
					);
				}}
			</Dropzone>

			<Form.Radio toggle label="Public" name="public" value={pub} checked={pub} onChange={(e) => setPub(!pub)} />
			<br />
			<Button>{props.id ? 'Update' : 'Submit'}</Button>
		</Form>
	);
};

const styles = {
	dropzone: {
		height: '150px',
		width: '150px',
		border: '1px dashed black',
		borderRadius: '5px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		padding: '10px'
	}
};

function ConnectedBoardForm(props) {
	return <AuthConsumer>{(auth) => <BoardForm {...props} auth={auth} />}</AuthConsumer>;
}

export default withRouter(ConnectedBoardForm);
