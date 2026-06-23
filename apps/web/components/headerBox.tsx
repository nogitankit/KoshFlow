import react from 'react'

const HeaderBox = ({type='title', title, user, subtext}: HeaderBoxProps) => {
  return(
    <div className='header-box'>
      <h1 className='header-box-title'>
        {title}
        {type === 'greeting' && (
          <span className='bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent'>&nbsp;{user}</span>
        )}
      </h1>
      <p className='header-box-subtext'>{subtext}</p>
    </div>
  )
}
export default HeaderBox