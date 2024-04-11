import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href={'/'} className='w-max'>
      <Image height={130} width={130} alt="logo" src={'/logo.png'} />
    </Link>
  );
};

export default Logo;
