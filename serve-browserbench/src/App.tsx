import React from "react";
import ReactLoading from "react-loading";
import { default as Stats } from "stats.js";
import { UAParser } from "ua-parser-js";

const parser = new UAParser();
var result = parser.getResult();

const browserbench = (window as any).browserbench as {
  startBenchmarking: () => Promise<void>;
  getBenchmarkText: () => string;
  isBenchmarking: () => boolean;
};

interface AppState {
  output: string;
  benchmarking: boolean;
}

export default class App extends React.Component<{}, AppState> {
  state = { output: browserbench.getBenchmarkText() } as AppState;

  componentDidMount = () => {
    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
    const animate = () => {
      stats.begin();
      stats.end();
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    setInterval(
      () => this.setState({ output: browserbench.getBenchmarkText(), benchmarking: browserbench.isBenchmarking() }),
      100
    );
  };

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            backgroundColor: "#282c34",
            minHeight: "100vh",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: "16px"
          }}
        >
          {(() => {
            if (!this.state.benchmarking) {
              return (
                <button
                  style={{
                    margin: "20px",
                    paddingTop: "5px",
                    paddingBottom: "5px",
                    paddingLeft: "15px",
                    paddingRight: "15px",
                    height: "30px"
                  }}
                  onClick={() => {
                    browserbench.startBenchmarking();
                  }}
                >
                  Start Benchmark
                </button>
              );
            } else {
              return <ReactLoading type={"cylon"} color={"white"} height={70} width={70} />;
            }
          })()}
          <div
            style={{
              fontFamily: "monospace",
              maxWidth: "80vw",
              background: "hsl(224, 8%, 22%)",
              borderRadius: "15px",
              padding: "15px"
            }}
          >
            <div>
              {/*`${result.browser.name} ${result.browser.major}, ` +
                `${result.os.name} ${result.os.version}, ` +
          `${this.getWebGLRenderer()}`*/}
            </div>
            <div
              style={{
                marginTop: "15px",
                overflow: "auto",
                textAlign: "left",
                whiteSpace: "pre-wrap",
                fontFamily: "monospace"
              }}
            >
              {this.state.output}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
