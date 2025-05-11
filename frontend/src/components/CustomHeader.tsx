import { FaLinkedin, FaGithub } from 'react-icons/fa';

export default function CustomHeader() {

	return (
		<header>
			<div
				className='flex items-center justify-center h-[70px]'>
				<div className='flex w-[80%] justify-between items-center'>
					<img
						title='Realmate logo'
						rel='noopener noreferrer'
						className='w-[200px] h-[36px]'
						src="https://realmate.com.br/wp-content/uploads/2024/08/LOGO-Realmate-Hero-e-rodape.svg" />
					<div className='flex w-[80px] justify-between'>
						<a title='Linkedin Profile' target='_blank'
							rel="noopener noreferrer" className='text-blue-700'
							href='https://www.linkedin.com/in/hcandido/'>
							<FaLinkedin size={30} />
						</a>
						<a title='Github Profile' target='_blank'
							rel="noopener noreferrer" className='text-black'
							href='https://github.com/HarrisonCaetanoCandido'>
							<FaGithub size={30} />
						</a>
					</div>
				</div>
			</div>
			<div className="h-[1px] bg-gradient-to-r from-blue-700 to-blue-400"></div>
		</header>
	);
}
