import React, { Component } from "react";
import { Jumbotron } from "react-bootstrap";
import withAuthorization from "../Session/withAuthorization";
import Firebase from "../Firebase/Firebase";
import { withFirebase } from "../Firebase/context";
import { Accordion, Card } from "react-bootstrap";
import { tasks } from "../../tasks";
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
      guess: "",
      taskguess: "",
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
        },
        { merge: true }
      )
      .then((snapshot) => {
        console.log("updated");
      });
  };
  handleChange = (e) => {
    e.preventDefault();
    this.setState({ file: e.target.files[0] });
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
            isVerified,
            isSubmitted,
            isRejected,
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
  win() {
    var uid = this.props.uid;
    const userRef = this.props.firebase.firestore.doc(
      `users/${this.props.uid}`
    );
    userRef
      .set(
        {
          finishtime: this.props.firebase.firestore.Timestamp.toDate(),
        },
        { merge: true }
      )
      .then((snapshot) => {
        console.log("updated");
      });
  }
  uploadTask() {
    return (
      <div className="col-sm-5 offset-sm-4 text-center">
        {this.state.isSubmitted == false ? (
          <>
            {" "}
            <input
              className="form-control-file"
              type="file"
              onChange={this.handleChange}
            />
            <div className="text-center py-3">
              <button className="btn btn-primary " onClick={this.handleUpload}>
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
  handleGuess = (level) => (e) => {
    e.preventDefault();
    if (this.state.taskguess == "abc") {
      this.setState({ level: level + 1 });
      this.updateDb();
    }
  };
  textTask(level) {
    if (level == 1) {
      return (
        <div className="col-sm-5 offset-sm-4 text-center">
          <input
            className="form-control "
            type="text"
            name="taskguess"
            onChange={this.handleInput}
          />
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
        {this.state.level == 1 || this.state.level == 7
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
                      2. Each block gets revealed once you successfully complete
                      the tasks assigned. <br />
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
                  <img src={this.state.url} className="img img-fluid" />
                </div>
              </Jumbotron>
              <form>
                <div className="form-group text-center">
                  <label>Make a guess!</label>
                  <div className="col-sm-5 offset-sm-3 text-center">
                    <input
                      className="form-control width-50 mx-10"
                      type="text"
                    />
                  </div>
                  <small className="form-text text-muted">
                    You only have {this.state.guesses} guesses remaining !
                  </small>
                  <div className="text-center py-3">
                    <button className="btn btn-primary ">Guess!</button>
                  </div>
                </div>
                <div className="form-group mx-10 text-center">
                  {this.state.level <= 11 ? (
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

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(withFirebase(Home));
