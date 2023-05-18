const state=
{
    tasklist:[],
}

// Dom
// const open_Task=document.querySelector(".open-task");
const showTask=document.querySelector(".show-modal")
const taskContent=document.querySelector(".task-content")

const htmlOpenTask=({id,title,type,url,textarea})=>
{
    return`
<div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
    <div class='card shadow-sm task__card'>
      <div class="d-flex justify-content-end mt-2 mx-4">
      <button type='button' class='btn btn-outline-info me-1' name=${id} onclick="editTask.apply(this, arguments)">
      <i class='fas fa-pencil-alt' name=${id}></i>
      </button>
      <button type='button' class='btn btn-outline-danger me-1' name=${id} onclick="deleteTask.apply(this, arguments)">
      <i class='fas fa-trash-alt' name=${id}></i>
      </button>
  </div>
       
        <div class="card-body">
        ${
            url
              ? `<img width='100%' height='150px' style="object-fit: cover; object-position: center"  src=${url} alt='card image cap' class='card-image-top md-3 rounded-lg' />`
              : `<img width='100%' height='150px' style="object-fit: cover; object-position: center"  src="profile.jpg" alt='card image cap' class='card-image-top md-3 rounded-lg' />`
          }
          <h4>${title}</h4>
          <p class="badge bg-primary mt-1">${type}</p>
          <P>${textarea}</P>

        </div>
       <div class="card-footer">
       <button type='button' class='btn btn-outline-primary float-right' data-bs-toggle='modal'data-bs-target='#showTask'id=${id}
       onclick='openTask.apply(this, arguments)'>Open Task
       </button></div>
</div>`

}

const htmlModalContent = ({ id, title, textarea, url }) => {
    const date = new Date(parseInt(id));
    return `
  <div id = ${id}>
  ${
    url
      ? `<img width='100%'  src=${url} alt='card image here  class='img-fluid place__holder__image mb-3'/>`
      : `<img width='100%' height='150px' style="object-fit: cover; object-position: center"  src="profile.jpg" alt='card image cap' class='card-image-top md-3 rounded-lg' />`
  }
  <strong class="text-sm text-muted">Created on ${date.toDateString()}</strong>
  <h2 class="my-3">${title}</h2>
  <p class=''>${textarea}</p>
  </div>`;
  };


// loading data


const updateLocalStorage = () => {
    localStorage.setItem(
      "task",
      JSON.stringify({
        tasks: state.taskList,
      })
    );
  };
// localstorage

const loadIntialdata=()=>
{
   const  localStorageData=JSON.parse(localStorage.tasks);
    if(localStorageData) state.tasklist==localStorageData.tasks;
    {
       state.tasklist.map((card)=>
       {
        taskContent.insertAdjacentHTML("before end",htmlOpenTask(card))
       })
    }
}

function handleSubmit(event)
{
    const id=`${Date.now()}`
    const input =
    {
        url:document.getElementById("url").value,
        title:document.getElementById("title").value,
        type:document.getElementById("type").value,
        description:document.getElementById("textarea").value,
    }
  
    taskContent.insertAdjacentHTML("beforeend",htmlOpenTask({...input,id}))
   
   state.tasklist.push({...input,id})
   
   updateLocalStorage();
}
// opentask

const openTask = (e) => {

    if (!e) e = window.event;
  
    const getTask = state.tasklist.find(({ id }) => id === e.target.id);
    showTask.innerHTML = htmlModalContent(getTask);
}  

// deleteTask
    
const deleteTask=(e)=>
{
    if(!e) e=windows.event;
    console.log(e);
    const targetId=e.target.getAttribute("name");
    const type=e.target;

    const removeTask=state.tasklist.filter((index)=> index!=targetId)
    updateLocalStorage()
    if (type==="button")
    {
       return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild
       (e.parentNode.parentNode.parentNode.parentNode)
    }
    else{
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild
        (e.target.parentNode.parentNode.parentNode)
}
}

// editTask
const editTask=(e)=>
{
    if(!e) e=windows.event
    const type=e.target.getAttribute("names")
    const id=e.target.Id
    let taskTitle;
    let taskType;
    let taskTextBox;
    let parentNode;
    let submitButton;
    if(type==="button")
    {
       parentNode=e.target.parentNode.parentNode
       
    }
    else
    {
      parentNode=e.target.parentNode.parentNode.parentNode
      
    }

    taskTitle=parentNode.childNodes[3].childNodes[3];
    taskType=parentNode.childNodes[3].childNodes[5];
    taskTextBox=parentNode.childNodes[3].childNodes[7];
    submitButton=parentNode.childNodes[5].childNodes[1];
    taskTitle.setAttribute('contenteditable',"true")
    taskType.setAttribute('contenteditable',"true")
    taskTextBox.setAttribute('contenteditable',"true")
    submitButton.setAttribute('onclick','saveEdit.apply(this.arguments)')
    submitButton.removeAttribute("data-bs-toggle")
    submitButton.removeAttribute("data-bs-target")
    submitButton.innerHTML="savechanges"


}
const saveEdit = (e) => {
  if (!e) e = window.event;

  const targetID = e.target.id;
  const parentNode = e.target.parentNode.parentNode;

  const taskTitle = parentNode.childNodes[3].childNodes[3];
  const taskDescription = parentNode.childNodes[3].childNodes[7];
  const taskType = parentNode.childNodes[3].childNodes[5];
  const submitButton = parentNode.childNodes[5].childNodes[1];

  const updatedData = {
    taskTitle: taskTitle.innerHTML,
    taskDescription: taskDescription.innerHTML,
    taskType: taskType.innerHTML,
  };

  let stateCopy = state.tasklist;
  stateCopy = stateCopy.map((task) =>
    task.id === targetID
      ? {
          id: task.id,
          title: updatedData.taskTitle,
          description: updatedData.taskDescription,
          type: updatedData.taskType,
          url: task.url,
        }
      : task
  );

  state.tasklist = stateCopy;
  updateLocalStorage();

  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");

  submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
  submitButton.setAttribute("data-bs-toggle", "modal");
  submitButton.setAttribute("data-bs-target", "#showTask");
  submitButton.innerHTML = "Open Task";
};

const search= (e) => {
  if (!e) e = window.event;

  while (taskContent.firstChild) {
    taskContent.removeChild(taskContent.firstChild);
  }

  const resultData = state.tasklist.filter(({ title }) =>
    title.toLowerCase().includes(e.target.value.toLowerCase())
  );

  resultData.map((cardData) =>
    taskContent.insertAdjacentHTML("beforeend", htmlOpenTask(cardData))
  );
};
