const gd = document.getElementById("gd");
const search = document.getElementById("search");
const category = document.getElementById("category");

// FETCH ALL POSTS WHEN YOU OPEN THE PAGE
async function fetchPosts() {
  try {
    const response = await fetch("http://localhost:3000/posts");
    if (!response.ok) {
      throw new Error(`${error.message}`);
    }
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.log(`Error code: ${error.message}`, error);
  }
}

// FUNCTION FOR CREATING EACH CARD FOR EACH POST
function cardPosts(posts) {
  let allCards;
  if (posts.length) {
    allCards = posts
      .map((post) => {
        return `
      <div class="card">
      <h2 class="title">${post.title}</h2>
          <p class="author">Author: <b>${post.author}</b> </p>
          <p class="body">${post.body}</p>
          <h5 class="email">${post.email}</h5>
          <section class="sp">
          <button class="btn change postEd" id=${post.id}>
            Edit
          </button>
          <button class="btn change editBody" id=${post.id}>
          Edit Post
          </button>
          <button class="btn change delete" id=${post.id}>
            Delete
          </button>
          </section>
      </div>`;
      })
      .join("");
  } else {
    allCards = "<p>Post not found!!!</p>";
  }
  gd.innerHTML = allCards;
}

// FOR PUT (REPLACING THE OLD POST WITH NEW POST)
function postEditor(editCards) {
  const postEds = document.querySelectorAll(`.${editCards}`);
  postEds.forEach((postEd) => {
    postEd.addEventListener("click", async (e) => {
      e.preventDefault();
      const editorId = e.target.getAttribute(`id`);

      const confirmEdit = confirm(
        "Are you sure you want to Edit this Post?"
      );
      if (!confirmEdit) {
        return;
      }
      const edtitle = prompt("Enter your Title");
      const edAuthor = prompt("Enter your Name");
      const edMail = prompt("Enter your Email");
      const edBody = prompt("Enter your Message");
      const putPost = {
        title: edtitle,
        author: edAuthor,
        email: edMail,
        body: edBody,
        // category: edtitle,
      };
      try {
        const response = await fetch(
          `http://localhost:3000/posts/${editorId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(putPost),
          }
        );
        if (!response.ok) {
          throw new Error(`Editing Post Failed: ${response.status}`);
        }

        const result = await response.json();
        console.log("Post partially updated!");
        console.log(result);
      } catch (error) {
        console.log(`Error: ${error.message}`, error);
      }
    });
  });
}

// FOR PATCHING THE POST
function editPost(edClass) {
  const edPosts = document.querySelectorAll(`.${edClass}`);
  edPosts.forEach((edPost) => {
    edPost.addEventListener("click", async (e) => {
      e.preventDefault();

      const edId = e.target.getAttribute(`id`);

      const ed = prompt("Enter your Message");
      const patchBody = {
        body: ed,
      };
      try {
        const response = await fetch(`http://localhost:3000/posts/${edId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patchBody),
        });
        if (!response.ok) {
          throw new Error(`Editing Body Failed: ${response.status}`);
        }

        const result = await response.json();
        console.log("Post partially updated!");
        console.log(result);
      } catch (error) {
        console.log(`Error: ${error.message}`, error);
      }
    });
  });
}

// FOR DELETIONG A POST
function deleteItems(items) {
  const deleteItems = document.querySelectorAll(`.${items}`);
  deleteItems.forEach((deleteItem) => {
    deleteItem.addEventListener("click", async (e) => {
      const getId = e.target.getAttribute(`id`);

      // CONFIRMATION MESSAGE
      const confirmDelete = confirm(
        "Are you sure you want to delete this Post?"
      );
      if (!confirmDelete) {
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/posts/${getId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error(`Delete Failed: ${response.status}`);
        }
        // FEEDBACK MESSAGE
        deleteItem.remove();
        alert("Post deleted successfully!");
      } catch (error) {
        console.log(`Error: ${error.message}`, error);
      }
    });
  });
}

// DISPLAY ALL THE POSTS THAT WAS MADE
async function showPosts(search = "", category = "") {
  const result = await fetchPosts();
  let allPosts = [];
  allPosts = result;
  if (search.length >= 3) {
    allPosts = result.filter((card) => {
      return (
        card.title.toLowerCase().includes(search.toLowerCase()) ||
        card.author.toLowerCase().includes(search.toLowerCase())
      );
    });
    if (category) {
      allPosts = allPosts.filter((post) => {
        return post.category == category;
      });
    }
  }
  cardPosts(allPosts);
  deleteItems("delete");
  editPost("editBody");
  postEditor("postEd");
}

// FUNCTION FOR THE SEARCHING A POST
function searchPosts(e) {
  e.preventDefault();
  showPosts(search.value, category.value);
}

// FUNCTION FOR THE CATEGORY OF A POST
function categoryPosts(e) {
  e.preventDefault();
  showPosts(search.value, category.value);
}

fetchPosts();
showPosts();
search.addEventListener("keyup", searchPosts);
category.addEventListener("click", categoryPosts);
