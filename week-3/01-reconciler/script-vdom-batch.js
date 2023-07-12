let vDOM = []; // Our initial vDOM is an empty array

function createDomElements() {
  var parentElement = document.getElementById("mainArea");

  var currentChildren = Array.from(parentElement.children);

  let added = 0, deleted = 0, updated = 0;
  // Now, we'll compare our new vDOM to our actual DOM
  vDOM.forEach(function(item) {
    // Check if a child with this ID already exists in the DOM
    var existingChild = currentChildren.find(function(child) {
      return child.dataset.id === String(item.id);
    });

    if (existingChild) {
      updated++;
      // If it exists, update it
      existingChild.children[0].innerHTML = item.title;
      existingChild.children[1].innerHTML = item.description;
      // Remove it from the currentChildren array
      currentChildren = currentChildren.filter(function(child) {
        return child !== existingChild;
      });
    } else {
      added++;
      // If it doesn't exist in the DOM, create it
      var childElement = document.createElement("div");
      childElement.dataset.id = item.id; // Store the ID on the element for future lookups

      var grandChildElement1 = document.createElement("span");
      grandChildElement1.innerHTML = item.title;

      var grandChildElement2 = document.createElement("span");
      grandChildElement2.innerHTML = item.description;

      var grandChildElement3 = document.createElement("button");
      grandChildElement3.innerHTML = "Delete";
      grandChildElement3.setAttribute("onclick", "deleteTodo(" + item.id + ")");

      childElement.appendChild(grandChildElement1);
      childElement.appendChild(grandChildElement2);
      childElement.appendChild(grandChildElement3);
      parentElement.appendChild(childElement);
    }
  });

  // Any children left in the currentChildren array no longer exist in the data, so remove them
  currentChildren.forEach(function(child) {
    deleted++;
    parentElement.removeChild(child);
  });

  console.log(added);
  console.log(updated);
  console.log(deleted);
}


function updateVirtualDom(data) {
    vDOM = data.map(item => {
        return {
          id: item.id,
          title: item.title,
          description: item.description
        };
      });
}
window.setInterval(() => {
    let todos = [];
    for (let i = 0; i<Math.floor(Math.random() * 100); i++) {
      todos.push({
        title: "Go to gym",
        description: "Go to gym from 5",
        id: i+1
      })
    }
  
    updateVirtualDom(todos); //upates virtual dom
  }, 5000);

window.setInterval(() => {
    createDomElements(); //actually update it
}, 1000);


//Why Virtual Dom was introduced?
/* 
In react there is a virtual dom taht can be easily translated as it si in a varible as state varaibles adn not as dom eleemns
Virtul dom because it is not the actual heavey ,expensive one it is sa copy of varibles
IN react Vdom is a very complex tree likeobject , in-mermoy rep os how dom looks likw
React main is to Manipualte dom and do diffs check 

  At multiple times we give ste and diffs , it dosent ahve ot copy dom everytime 
  So it maintains  an inmemory virtaul dom  
    It compares curect state to virtual dom finds diffs and then changes based on the diffs

    Mild Optimization from getting Vdom 
    It is very USeful , removes the overhead ot get teh current dom 

    at any time Virtual DOM is the current representaion of teh dom 
      So we can DO Batch Updates
        Any time an upadte happens we take it to dom
          What if we could batch this upadte 
            We can find diffs calcualte chagnes in bulk as the state changes and tehn aplly tehm otgether to teh amin dom 
              THisis the main optimiation in reactjs
          
  Barching Updates is one most imporatnt one react does
  

*/
