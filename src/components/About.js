import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function About(props) {
   // const [myStyle,setMyStyle] = useState({
   //     color: "black",
   //     backgroundColor: "white",
   // })
   let myStyle = {
       color: props.mode === 'dark' ? 'white' : '#042743',
       backgroundColor: props.mode === 'dark' ? 'rgb(36, 74, 104)' : 'white',
       border: '2px solid',
       borderColor: props.mode === 'dark' ? 'white' : '#042743',
   }

  return (
    <div className="container" style={{ color: props.mode === 'dark' ? 'white' : '#042743' }}>
    <h1 className="my-3"> About Us </h1>
<div className="accordion" id="accordionExample" style={myStyle}>
  <div className="accordion-item">
    <h2 className="accordion-header">
      <button className="accordion-button" type="button" style={myStyle} data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        <strong>Analyze your text</strong>
      </button>
    </h2>
    <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
      <div className="accordion-body" style={myStyle}>
        Text Analysis gives you a way to analyze your text quickly and efficiently. Be it uppercase, lowercase, or removing extra spaces, this tool has got you covered. It also provides a word count and character count for your convenience.
        </div>
    </div>
  </div>
  <div className="accordion-item">
    <h2 className="accordion-header">
      <button className="accordion-button collapsed" style={myStyle} type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        <strong>Free to use</strong>
      </button>
    </h2>
    <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div className="accordion-body" style={myStyle}>
        Text Analysis is a free tool that allows you to analyze your text without any cost. You can use it anytime, anywhere, without any restrictions.
        </div>
    </div>
  </div>
  <div className="accordion-item">
    <h2 className="accordion-header">
      <button className="accordion-button collapsed" style={myStyle} type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
        <strong>Browser compatible</strong>
      </button>
    </h2>
    <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
      <div className="accordion-body" style={myStyle}>
        This tool is compatible with all browsers, making it accessible to everyone. Whether you are using Chrome, Firefox, Safari, or any other browser, you can use Text Analysis without any issues.
        </div>
    </div>
  </div>
</div>
    </div>
  );
}
