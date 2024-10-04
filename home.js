const BASE_URL = "https://user-list.alphacamp.io/"
const INDEX_URL = BASE_URL + "api/v1/users/"
const userData = document.querySelector("#user-data")
const userPerPage = 12
const paginator = document.querySelector("#paginator")
const totalUserList = JSON.parse(localStorage.getItem("totalUserList"))
let currentUserList = []

//dynamically generate user card
function renderUserData (data){ //data = specific user list you want to show on the screen
  let rawHTML = ``
  data.forEach(user => {
    rawHTML += `
  <div class = "col-sm-3 mt-1 mb-1">
    <div class="card" style="width: auto;">
      <img src="${user.avatar
      }" class="card-img-top" alt="card image" data-bs-toggle="modal" data-bs-target="#user-modal" data-id = "${user.id}">
      <div class="card-body">
        <h5 class="card-title">${user.name}</h5>
      </div>
      <div class = "card-footer">
        <botton class="btn btn-primary" id = "add-to-favorite" data-id = "${user.id}" style = "font-weight: bold">+</botton>
      </div>
    </div>
  </div>
  `
  })

  userData.innerHTML = rawHTML
}

//initial the page
axios.get(INDEX_URL).then(response => {
  currentUserList = response.data.results
  renderUserData(currentUserList)
  generatePaginator(currentUserList.length)
  getUserByPage(1, currentUserList)
})

//add event listener to show modal or add user to favorite
const dataPanel = document.querySelector("#data-panel")
dataPanel.addEventListener("click", event => {
  //show modal
  if (event.target.matches(".card-img-top")){
    showUserDetails(Number(event.target.dataset.id))
  }
  //add to favorite
  else if (event.target.matches("#add-to-favorite")){
    addToFavorite(Number(event.target.dataset.id))
  }
})

//show specific user details
function showUserDetails (id){
  axios.get(INDEX_URL + id).then (response => {
    let userDetails = response.data
    const userFullName = document.querySelector("#user-full-name")
    const userModalImage = document.querySelector("#user-modal-image")
    const userDescription = document.querySelector("#user-description")

    userFullName.innerText = `${userDetails.name} ${userDetails.surname}`
    userModalImage.innerHTML = `<img src= ${userDetails.avatar} class="user-image img-fluid" alt="card image">`
    userDescription.innerText = `
    age: ${userDetails.age}
    birthday: ${userDetails.birthday}
    email: ${userDetails.email}
    gender: ${userDetails.gender}
    region: ${userDetails.region}
    `
  })
}

//save favorite to local storage
function addToFavorite(id){
  const favoriteUserList = JSON.parse (localStorage.getItem("favoriteUsers")) || []
  const user = totalUserList.find(user => user.id === id)
  if (favoriteUserList.some(user => user.id === id)){
    return alert ("User exiested in favorite User List")
  }
  favoriteUserList.push(user)
  localStorage.setItem("favoriteUsers", JSON.stringify(favoriteUserList))
}

//when favorite clicked, show the favorite.html file 
const title = document.querySelector("#title")
title.addEventListener("click", event =>{

  if(event.target.matches("#favorite")){
    //favorite clicked
    const favorite = JSON.parse (localStorage.getItem("favoriteUsers"))
    if (favorite.length === 0){
      return alert ("no favorite user saved")
    }
    window.location.href = "favorite.html"
  }
})

//get user by page
function getUserByPage (page, data){
  const startIndex = (page - 1) * userPerPage
  userListForPage = data.slice (startIndex, startIndex + userPerPage)
  renderUserData(userListForPage)
}

//generate paginator according to user amounts
function generatePaginator (listLength){
  let rawHTML = ``
  let pages = listLength / userPerPage
  if (listLength % userPerPage === 0){
    for (let i = 1; i <= pages; i++){
      rawHTML += `
      <li class="page-item"><a class="page-link" href="#">${i}</a></li>
        `
    }
  }else{
      pages += 1
      for (let i = 1; i <= pages; i++){
        rawHTML += `
        <li class="page-item"><a class="page-link" href="#">${i}</a></li>
          `
      }
  }
  paginator.innerHTML = rawHTML
}

//switch between pages
paginator.addEventListener("click", event =>{
  if (event.target.matches(".page-link")){
    const page = event.target.innerText
    getUserByPage(page, currentUserList)
  }
})

//search
const submit = document.querySelector("#submit")
submit.addEventListener("click", function searchUser (event){
  const searchInput = document.querySelector("#search-input")
  if (searchInput.value.length === 0){
    return alert ("please enter a valid keyword")
  }else{
    const filteredUsers = totalUserList.filter (user => user.name.toLowerCase().includes(searchInput.value.toLowerCase()))
    if (filteredUsers.length === 0){
      return alert ("no user found")
    }else{
      currentUserList = filteredUsers
      renderUserData(currentUserList)
      generatePaginator(currentUserList.length)
      getUserByPage(1, currentUserList)
    }
  }
})

