import { getAuth } from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

// Uploads an image to Firebase storage
const uploadImage = async (image) => {
  const auth = getAuth();

  return new Promise((resolve, reject) => {
    const storage = getStorage();
    const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

    const storageRef = ref(storage, `images/${filename}`);

    const uploadTask = uploadBytesResumable(storageRef, image);

    // copied from Firebase docs
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        switch (snapshot.state) {
          case 'paused':
            break;
          case 'running':
            break;
          default:
            break;
        }
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

export default uploadImage;
