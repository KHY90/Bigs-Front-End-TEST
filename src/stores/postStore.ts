import { makeAutoObservable } from "mobx";

class PostStore {
  title = "";
  category = "";
  content = "";
  image: File | null = null;
  preview: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setTitle(title: string) {
    this.title = title;
  }

  setCategory(category: string) {
    this.category = category;
  }

  setContent(content: string) {
    this.content = content;
  }

  setImage(file: File | null) {
    this.image = file;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.preview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.preview = null;
    }
  }

  clearForm() {
    this.title = "";
    this.category = "";
    this.content = "";
    this.image = null;
    this.preview = null;
  }
}

const postStore = new PostStore();
export default postStore;
