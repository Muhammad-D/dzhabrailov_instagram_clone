import { Button, makeStyles, Modal, Input } from "@material-ui/core";
import { useEffect, useState } from "react";
import instagramLogo2 from "./assets/images/Instagram_logo_files/instagram_Logo2.png";
import instagramLogo from "./assets/images/Instagram_logo_files/instagram_Logo.png";
import instagramLogo3 from "./assets/images/Instagram_logo_files/Instagram_Logo3.svg";
import Post from "./components/Post/Post";
import { db, auth } from "./firebase";
import ImageUpload from "./components/ImageUpload/ImageUpload";
import "./App.css";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, userName]);

  const signUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: userName,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const signIn = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch((error) => {
      alert(error.message);
    });
    setOpenSignIn(false);
  };

  return (
    <div className="app">
      {/* POP-UP WINDOW  ///////////////////////////////////////////////////////  */}
      <Modal open={open} onClose={(e) => setOpen(false)}>
        <div style={modalStyle} className={`${classes.paper} pop-up-window`}>
          <form className="pop-up-window__form">
            <center>
              <img
                className="pop-up-window__image"
                src={instagramLogo}
                alt=""
              />
            </center>
            <Input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.currentTarget.value)}
            />
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={(e) => setOpenSignIn(false)}>
        <div style={modalStyle} className={`${classes.paper} pop-up-window`}>
          <form className="pop-up-window__form">
            <center>
              <img
                className="pop-up-window__image"
                src={instagramLogo}
                alt=""
              />
            </center>
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>
      {/* HEADER /////////////////////////////////////////////////////// */}
      <div className="header">
        <span>
          <img
            className="header__image header__image_visible"
            src={instagramLogo2}
          />
          <img className="header__image" src={instagramLogo3} />
        </span>
        {user ? (
          <Button onClick={(e) => auth.signOut()}>Logout</Button>
        ) : (
          <div>
            <Button onClick={(e) => setOpen(true)}>Sign up</Button>
            <Button onClick={(e) => setOpenSignIn(true)}>Sign in</Button>
          </div>
        )}
      </div>
      {/* POSTS ///////////////////////////////////////////////////////  */}

      <div className="posts">
        <div className="posts posts_left">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              commentPoster={user}
              userName={post.userName}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>You need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
