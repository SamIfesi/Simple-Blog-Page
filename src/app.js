const gd = document.getElementById("gd");
const form = document.getElementById("inputs");
const btn = document.getElementById("btn");
const title = document.getElementById("inputTitle");
const author = document.getElementById("inputAuthor");
const email = document.getElementById("inputEmail");
const body = document.getElementById("inputBody");
const category = document.getElementById("category");
const viewPost = document.getElementById("change");

viewPost.addEventListener("click", () => {
  window.location.href = "./post.html";
});

form.addEventListener("submit", async (e) => {
  let inputValues = {
    title: title.value,
    author: author.value,
    email: email.value,
    body: body.value,
    category: category.value,
  };
  if (
    title.value === "" ||
    author.value === "" ||
    email.value === "" ||
    body.value === ""
  ) {
    e.preventDefault();
    alert("Please fill in all fields.");
    return;
  }
  try {
    const response = await fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputValues),
    });
    if (!response.ok) {
      throw new Error(`Error Mesaage: ${response.status}`);
    }
    const res = await response.json();
  } catch (error) {
    alert(`Error Message: ${error.message}`, error);
  } finally {
    alert("Sucessfully Posted your Blog");
  }
});

async function updatePostFully(postId) {
  const updatedValues = {
    title: title.value,
    author: author.value,
    email: email.value,
    body: body.value,
  };

  try {
    const response = await fetch(`http://localhost:3000/posts/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedValues),
    });

    if (!response.ok) {
      throw new Error(`PUT failed: ${response.status}`);
    }
    const result = await response.json();
    alert("Post fully updated!");
    console.log(result);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

async function updatePostPartially(postId) {
  const partialUpdate = {
    body: body.value,
  };

  try {
    const response = await fetch(`http://localhost:3000/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partialUpdate),
    });

    if (!response.ok) {
      throw new Error(`PATCH failed: ${response.status}`);
    }

    const result = await response.json();
    alert("Post partially updated!");
    console.log(result);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

// for Upadate Button
const putBtn = document.getElementById("putBtn");
const patchBtn = document.getElementById("patchBtn");

putBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const postId = prompt("Enter the ID of the post to fully update:");
  updatePostFully(postId);
});

patchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const postId = prompt("Enter the ID of the post to partially update:");
  updatePostPartially(postId);
});
