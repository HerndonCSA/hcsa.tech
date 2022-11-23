import { TypeAnimation } from 'react-type-animation';

export default function Info() {
  return (
  
    <div className="flex">
        <h3>A place for students to explore</h3>
    <TypeAnimation
      sequence={[
        ' the countless fields of computer science.', // Types 'One'
        1000, // Waits 1s
        ' artifical inteligence', // Deletes 'One' and types 'Two'
        2000, // Waits 2s
        'Two Three', // Types 'Three' without deleting 'Two'
        () => {
          console.log('Done typing!'); // Place optional callbacks anywhere in the array
        }
      ]}
      wrapper="div"
      cursor={true}
      repeat={Infinity}
      style={{ fontSize: '30px' }}
    />
    </div>
  );
};