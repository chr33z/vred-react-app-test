import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [activeStep, setActiveStep] = useState(0); // Step 0, 1, 2
  const [connectionInfo, setConnectionInfo] = useState({ ip: "127.0.0.1", port: 8888 });

  useEffect(() => {
    findLocalHost();

    const handleWebengineEvent = (event) => _handleWebengineEvent(event);
    document.addEventListener("Action", handleWebengineEvent);
    return () => {
      document.removeEventListener("Action", handleWebengineEvent);
    };
  }, []);

  let count = 0;

  const _handleWebengineEvent = async (event) => {
    const action = event.detail.action;
    await logMessage(`[info] Current Step: ${activeStep}`);
    await logMessage(`[info] Received action: ${action}; Receive-ID: #${count++}`);

    switch (action) {
      case "next":
        nextStep();
        break;
      case "previous":
        previousStep();
        break;
    }
  };

  const nextStep = () => {
    const nextStep = (activeStep + 1) % 3;
    logMessage(`[info] Set Step: ${nextStep}`);
    setActiveStep(nextStep);
  };

  const previousStep = () => {
    const step = activeStep - 1;
    const previousStep = step < 0 ? 2 : step % 3;
    logMessage(`[info] Set Step: ${previousStep}`);
    setActiveStep(previousStep);
  };

  const logMessage = async (message) => {
    console.log(message);
    await sendScript("print('" + message + "')");
  };

  const sendScript = async (script) => {
    const encodedScript = encodeURIComponent(script);
    await axios.get(`http://${connectionInfo.ip}:${connectionInfo.port}/python?value=${encodedScript}`);
  };

  const findLocalHost = () => {
    return new Promise(() => {
      let hostname = window.location.hostname;
      if (hostname === "localhost") {
        hostname = "127.0.0.1";
      }
      setConnectionInfo({
        ip: hostname,
        port: 8888,
      });
    });
  };

  return (
    <div className="container">
      {activeStep === 0 && (
        <div className="state1 button" onClick={() => nextStep()}>
          0
        </div>
      )}
      {activeStep === 1 && (
        <div className="state2 button" onClick={() => nextStep()}>
          1
        </div>
      )}
      {activeStep === 2 && (
        <div className="state3 button" onClick={() => nextStep()}>
          2
        </div>
      )}
    </div>
  );
}

export default App;
