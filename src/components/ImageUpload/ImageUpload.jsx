import { Button, Input } from "@material-ui/core";
import React, { useState } from "react";
import { db, storage } from "../../firebase";
import firebase from "firebase";
import "./ImageUpload.css";

const ImageUpload = ({ username }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files["0"]) {
      setImage(e.target.files["0"]);
    }
  };

  const handleUpload = (e) => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error.message);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption,
              imageUrl: url,
              userName: username,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="image-upload">
      <progress
        className="image-upload__progress-bar"
        value={progress}
        max="100"
      />
      <Input
        type="text"
        placeholder="Enter a caption..."
        value={caption}
        onChange={(e) => {
          setCaption(e.currentTarget.value);
        }}
      />
      <Input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
};

export default ImageUpload;
