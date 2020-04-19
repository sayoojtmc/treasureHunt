import React, { Component } from "react";
import { Jumbotron } from "react-bootstrap";
import withAuthorization from "../Session/withAuthorization";
import Firebase from "../Firebase/Firebase";
import { withFirebase } from "../Firebase/context";
import { Accordion, Card } from "react-bootstrap";
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
    };
  }
  updateDb = () => {
    const userRef = this.props.firestore.doc(`users/${this.props.uid}`);
    userRef.set(this.state, { merge: true }).then((snapshot) => {
      console.log("updated");
    });
  };
  handleChange = (e) => {
    e.preventDefault();
    this.setState({ file: e.target.files[0] });
  };
  handleUpload = (event) => {
    event.preventDefault();
    var storage = this.props.firebase.storage;

    var filename = this.state.file.name;
    var name = filename.split(".")[0];
    var extension = name.split(".")[1];
    try {
      var pathReference = storage.ref(`tasks/${this.state.level}`);
      pathReference.put(this.state.file).then((snapshot) => {
        pathReference.getDownloadURL().then((url) => {
          console.log(url);
          this.setState({ file: null });
        });
      });
    } catch (e) {
      console.log(e);
    }
  };
  componentDidMount() {
    console.log(this.props);
    const db = this.props.firebase.firestore
      .doc(`users/${this.props.uid}`)
      .get()
      .then((snapshot) => {
        try {
          var level = snapshot.data()["level"];
          var guess = snapshot.data()["guesses"];
          console.log(level, guess);
          this.setState({ level: level, guesses: guess });
        } catch (e) {}
      });
    var storage = this.props.firebase.storage;
    var pathReference = storage.ref(`images/${this.state.level}.jpg`);
    pathReference.getDownloadURL().then((url) => {
      try {
        this.setState({ url: url });
      } catch (e) {
        console.log(e);
      }
    });
  }
  geturl() {
    var storage = this.props.firebase.storage;
    var pathReference = storage.ref(`images/${this.state.level}.jpg`);
    pathReference.getDownloadURL().then((url) => {
      console.log(url);
      return url;
    });
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
                      You are given a partial image and you have 4 tries to
                      guess the image. To reveal more of the image you can
                      complete the given tasks.
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
                  <label>upload task</label>
                  <div className="col-sm-5 offset-sm-4 text-center">
                    <input
                      className="form-control-file"
                      type="file"
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="text-center py-3">
                    <button
                      className="btn btn-primary "
                      onClick={this.handleUpload}
                    >
                      Upload!
                    </button>
                  </div>
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
