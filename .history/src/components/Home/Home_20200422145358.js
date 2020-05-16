import React, { Component } from "react";
import { Jumbotron } from "react-bootstrap";
import withAuthorization from "../Session/withAuthorization";
import { withFirebase } from "../Firebase/context";
import { Accordion, Card } from "react-bootstrap";
import { tasks } from "../../tasks";
import connect from "./connect.jpeg";
import cross from "./cross.jpg";

import cryptoJS from "crypto";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      level: 1,
      guesses: 4,
      url: "",
      file: null,
      isSubmitted: false,
      isVerified: false,
      isRejected: false,
      sizeExceeded: false,
      guess: "",
      taskguess: "",
      uname: "",
      guessEmpty: false,
      taskEmpty: false,
      isWin: false,
    };
  }
  updateDb = () => {
    const userRef = this.props.firebase.firestore.doc(
      `users/${this.props.uid}`
    );
    userRef
      .set(
        {
          isSubmitted: this.state.isSubmitted,
          isVerified: this.state.isVerified,
          isRejected: this.state.isRejected,
          level: this.state.level,
          guesses: this.state.guesses,
        },
        { merge: true }
      )
      .then((snapshot) => {
        console.log("updated");
      });
  };
  handleChange = (e) => {
    e.preventDefault();
    let size = e.target.files[0].size / (1024 * 1024);
    if (size > 1) {
      e.target.value = "";
      this.setState({ sizeExceeded: true });
    } else this.setState({ file: e.target.files[0] });
  };
  handleInput = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };
  handleUpload = (event) => {
    event.preventDefault();
    var storage = this.props.firebase.storage;
    var filename = this.state.file.name;
    var name = filename.split(".")[0];
    var extension = name.split(".")[1];
    try {
      var pathReference = storage.ref(
        `tasks/${this.props.uid}/${this.state.level}`
      );
      pathReference.put(this.state.file).then((snapshot) => {
        pathReference.getDownloadURL().then((url) => {
          console.log(url);
          this.setState({ file: null, isSubmitted: true, isRejected: false });
          console.log(this.state.subTime);
          this.updateDb();
        });
      });
    } catch (e) {
      console.log(e);
    }
  };
  componentDidMount() {
    const db = this.props.firebase.firestore
      .doc(`users/${this.props.uid}`)
      .get()
      .then((snapshot) => {
        try {
          var level = snapshot.data()["level"];
          var guess = snapshot.data()["guesses"];
          var isVerified = snapshot.data()["isVerified"];
          var isSubmitted = snapshot.data()["isSubmitted"];
          var isRejected = snapshot.data()["isRejected"];
          var storage = this.props.firebase.storage;
          var pathReference = storage.ref(`images/${level}.jpg`);
          pathReference.getDownloadURL().then((url) => {
            try {
              this.setState({ url: url });
            } catch (e) {
              console.log(e);
            }
          });
          var role = snapshot.data()["role"];
          console.log(level, guess);
          this.setState({
            level: level,
            guesses: guess,
            isVerified: false,
            isSubmitted: false,
            isRejected: isRejected,
            role,
          });
          if (isSubmitted && isVerified) {
            this.setState({
              isSubmitted: false,
              isRejected: false,
              level: level + 1,
            });
            this.updateDb();
          }
        } catch (e) {}
      });
    if (typeof window != "undefined") {
      localStorage.setItem("auth", JSON.stringify(this.state));
    }
  }
  geturl() {
    var storage = this.props.firebase.storage;
    var pathReference = storage.ref(`images/${this.state.level}.jpg`);
    pathReference.getDownloadURL().then((url) => {
      console.log(url);
      return url;
    });
  }

  win = (e) => {
    e.preventDefault();
    if (this.state.guess.length < 1) {
      this.setState({ guessEmpty: true });
      return;
    }
    var guessLow = this.state.guess.toLowerCase();
    var hash = cryptoJS.createHash("sha256").update(guessLow).digest("hex");
    if (
      hash == "4864429fe7e471eb9b972603a998dbaad345e5aab16f1e1cd556a6f754c44ac8"
    ) {
      this.props.firebase.firestore
        .doc(`users/${this.props.uid}`)
        .get()
        .then((snapshot) => {
          try {
            var uname = JSON.stringify(snapshot.data()["username"]);
            this.setState({ uname: uname, isWin: true });
          } catch (e) {}
        });

      setTimeout(() => {
        let time = new Date().toLocaleString();
        const userRef = this.props.firebase.firestore.doc(
          `winners/${this.props.uid}`
        );
        userRef
          .set(
            {
              finishtime: time,
              username: this.state.uname,
            },
            { merge: true }
          )
          .then((snapshot) => {
            console.log("updated");
          });
      }, 2000);
    } else {
      alert("wrong answer!");
      this.props.firebase.firestore
        .doc(`users/${this.props.uid}`)
        .update({
          guesses: this.state.guesses - 1,
        })
        .then((doc) => {
          this.setState({ guesses: this.state.guesses - 1 });
        });
      console.log(this.state.guesses);
    }
  };
  uploadTask() {
    if (this.state.level === 3) {
      return (
        <div className="col-sm-5 offset-sm-4 text-center">
          {this.state.isSubmitted === false ? (
            <>
              {" "}
              <Jumbotron className="my-5 mx-5">
                <div>
                  <img src={cross} alt="error" className="img img-fluid" />
                </div>
              </Jumbotron>
              <input
                className="form-control-file"
                type="file"
                onChange={this.handleChange}
              />
              {this.state.sizeExceeded === false ? (
                <div></div>
              ) : (
                <div style={{ color: "red" }}>
                  <br />
                  File size should be less than 1MB.
                  {setTimeout(
                    () => this.setState({ sizeExceeded: false }),
                    3000
                  )}
                </div>
              )}
              <div className="text-center py-3">
                <button
                  className="btn btn-primary "
                  onClick={this.handleUpload}
                  disabled={this.state.sizeExceeded}
                >
                  Upload!
                </button>
              </div>
            </>
          ) : (
            <h1 className="text-bold">
              Wait for admins to verify your submission!
            </h1>
          )}
        </div>
      );
    } else {
      return (
        <div className="col-sm-5 offset-sm-4 text-center">
          {this.state.isSubmitted === false ? (
            <>
              {" "}
              <input
                className="form-control-file"
                type="file"
                onChange={this.handleChange}
              />
              {this.state.sizeExceeded === false ? (
                <div></div>
              ) : (
                <div style={{ color: "red" }}>
                  <br />
                  File size should be less than 1MB.
                  {setTimeout(
                    () => this.setState({ sizeExceeded: false }),
                    3000
                  )}
                </div>
              )}
              <div className="text-center py-3">
                <button
                  className="btn btn-primary "
                  onClick={this.handleUpload}
                  disabled={this.state.sizeExceeded}
                >
                  Upload!
                </button>
              </div>
            </>
          ) : (
            <h1 className="text-bold">
              Wait for admins to verify your submission!
            </h1>
          )}
        </div>
      );
    }
  }
  handleGuess = (level) => (e) => {
    e.preventDefault();
    if (this.state.taskguess == "") {
      this.setState({ taskEmpty: true });
    }
    var guessLow = this.state.taskguess.toLowerCase();
    var hash = cryptoJS.createHash("sha256").update(guessLow).digest("hex");

    if (this.state.taskguess === "abc" && level === 1) {
      this.setState({ level: this.state.level + 1, isSubmitted: false });
      setTimeout(() => {
        console.log(this.state.level);
        this.updateDb();
        setTimeout(() => window.location.reload(true), 2000);
      }, 1000);
    }

    if (this.state.taskguess != "abc" && level === 1) {
      alert("Wrong answer!!");
    }
    if (
      hash ===
        "c401b670b8d80d39dc2d88a736afaaa2244d7b0cc2a2ec8a1a0e5fbe66f4a8aa" &&
      level === 7
    ) {
      this.setState({ level: this.state.level + 1, isSubmitted: false });
      setTimeout(() => {
        console.log(this.state.level);
        this.updateDb();
        setTimeout(() => window.location.reload(true), 2000);
      }, 1000);
    }
    if (this.state.taskguess != "def" && level === 7) alert("Wrong answer!!");
  };
  textTask(level) {
    if (level === 1) {
      return (
        <div className="col-sm-5 offset-sm-4 text-center">
          <input
            className="form-control "
            type="text"
            name="taskguess"
            onChange={this.handleInput}
          />
          {this.state.taskEmpty ? <p>Please type something</p> : ""}
          <button
            className="btn btn-primary my-3 "
            onClick={this.handleGuess(level)}
          >
            submit
          </button>
        </div>
      );
    } else if (level === 7) {
      return (
        <div className="col-sm-5 offset-sm-4 text-center">
          <Jumbotron className="my-5 mx-5">
            <div>
              <img src={connect} alt="error" className="img img-fluid" />
            </div>
          </Jumbotron>
          <input
            className="form-control "
            type="text"
            name="taskguess"
            onChange={this.handleInput}
          />

          {this.state.taskEmpty ? <p>Please type something</p> : ""}
          <button
            className="btn btn-primary my-3 "
            onClick={this.handleGuess(level)}
          >
            submit
          </button>
        </div>
      );
    }
  }
  TaskTab() {
    return (
      <>
        <label>{tasks[this.state.level - 1]}</label>
        {this.state.level === 1 || this.state.level === 7
          ? this.textTask(this.state.level)
          : this.uploadTask()}
        {this.state.isRejected ? (
          <label className="text-danger">
            Your submission was rejected retry...
          </label>
        ) : (
          ""
        )}
      </>
    );
  }
  render() {
    if (this.state.isWin) {
      return <p>Congratulations!, please wait for your results!</p>;
    } else {
      return (
        <div>
          <div
            style={{
              height: "50vh",
              alignItems: "center",
            }}
          >
            <div className="row">
              <div className="col-md-6 offset-sm-3">
                <Accordion defaultActiveKey="1">
                  <Card>
                    <Accordion.Toggle
                      as={Card.Header}
                      variant="link"
                      eventKey="0"
                    >
                      How to play
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                      <Card.Body>
                        1. Identify the person behind the blocks. <br />
                        2. Each block gets revealed once you successfully
                        complete the tasks assigned. <br />
                        3. The duration of the game will be 5 days, after the
                        commencement. <br />
                        4. Each participant has ONLY THREE chances to guess the
                        person and if the third one goes wrong you will be
                        eliminated! <br />
                        5. The winner will be the one to find out the person at
                        first. <br />
                        6. Be quick!! Incase of multiple winners, let the draw
                        decide. Why wait? Let the hunt begin
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                  <div></div>
                </Accordion>
                <Jumbotron className="my-5 mx-5">
                  <div>
                    <img
                      src={this.state.url}
                      alt="error"
                      className="img img-fluid"
                    />
                  </div>
                </Jumbotron>
                <form>
                  {this.state.guesses > 0 ? (
                    <div className="form-group text-center">
                      <label>Make a guess!</label>
                      <div className="col-sm-5 offset-sm-3 text-center">
                        <input
                          className="form-control width-50 mx-10"
                          type="text"
                          name="guess"
                          onChange={this.handleInput}
                        />
                      </div>
                      {this.state.guessEmpty ? (
                        <p>Please type something</p>
                      ) : (
                        ""
                      )}
                      <small className="form-text text-muted">
                        You only have {this.state.guesses} guesses remaining !
                      </small>
                      <div className="text-center py-3">
                        <button className="btn btn-primary " onClick={this.win}>
                          Guess!
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div classname="col-sm-5 offset-sm-3 text-center">
                      <h1 style={{ textAlign: "center" }}> GAME OVER</h1>
                    </div>
                  )}
                  <div className="form-group mx-10 text-center">
                    {this.state.level < 11 && this.state.guesses > 0 ? (
                      this.TaskTab()
                    ) : (
                      <p>no more tasks</p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(withFirebase(Home));
