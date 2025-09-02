import { AiFillGithub } from "react-icons/ai"

const Footer = () => {
  return (
    <footer className='absolute bottom-2 text-gray-500 text-sm'>
      <div className='flex flex-row gap-2 text-center justify-center items-center'>
        <div>Documentation <a href="https://github.com/goyovm/fuepucha" target="_blank" rel="noopener noreferrer">here</a></div>
        <AiFillGithub className='text-gray-500' />
      </div>
      <div>© 2025 Hackaton Fuepucha</div>
    </footer>
  )
}

export default Footer;
