const userModel = require('../models/userModel')
const fetchUser = async (req) => {
  try { 
    const {userId} = req.user;
    const user = await userModel.findById(userId);
    if(!user) {
      throw new Error('User not found');
    }else{
      return user;
    }
  } catch (error) {
    throw new Error('Internal Server error', error);
  }
}

const showCatchError = (error, res) => {
    if (error.message === 'User not found') {
        return res.status(404).json({ success: false, error: error.message });
      }
      console.error('Error fetching tasks:', error);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
}

// Fetch tasks
const fetchTasks = async (req, res) => {
    console.log('kkk');
    
    try {
      const user = await fetchUser(req);
      const tasks = user.tasks;
      
      return res.status(200).json({tasks});
    } catch (error) {
        return showCatchError(error, res);
    }
}
  
// 
const fetchSpecificTask = async (req, res) => {
    console.log('In fetch specific func');
    const {task_id} = req.params;
    
    try {
      const user = await fetchUser(req);

      const taskDetails = user.tasks.find((task) => task._id.toString() === task_id); 

      console.log(taskDetails);
      
      return res.status(200).json({taskDetails});
    } catch (error) {
        return showCatchError(error, res);
    }
}
  

// ADD TASK
const addTask = async (req, res) => {
    try {
        const taskDetails = req.body;
        if(!taskDetails){
            return res.status(400).json({success: false, error: "Task details are required"});
        }
        // fetch user 
        const user = await fetchUser(req);
        // that user's tasks
        const tasks = user.tasks

        // push 
        tasks.push(taskDetails);
        user.tasks = tasks;
        await user.save();
        return res.status(201).json({success: true, message: "Task added successfully"});
    } catch (error) {
        if(error.message === 'User not found'){
            return res.status(404).json({ success: false, error: error.message });
        }
        console.error('Error fetching tasks:', error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
    
}


// Update Task
const updateTaskDetails = async (req, res) => {
    try {
        console.log("In update task func");
        
        // task_id from params
        // taskDetails from body
        const {task_id} = req.params;
        const taskDetails = req.body;

        
        // if !taskDetails
        if(!taskDetails){
            return res.status(400).json({success: false, error: "Task details are required"});
        }
        // findind user
        const user = await fetchUser(req);
        
        // find the task from user object
        const task = user.tasks.find((task) => task._id.toString().trim() === task_id);
        // if (!task)
        if(!task){
            return res.status(404).json({success: false, error: "Task not found"});
        }
        
        // change the name & save
        task.title = taskDetails.title;
        
        task.description = taskDetails.description;
        console.log(task);
        await user.save();

        return res.status(200).json({success: true, message: "Task updated successfully", tasks: user.tasks});
    } catch (error) {
        return showCatchError(error, res);
    }
    
}

// Delete Task
const deleteTask = async (req, res) => {
    try {
        // task_id from params
        const {task_id} = req.params
        console.log(task_id);
        
        // find user
        const user = await fetchUser(req);
        // filter() - remove the task
        const tasks = user.tasks.filter((task) => task._id.toString().trim() !== task_id.trim());
        
        user.tasks = tasks;

        await user.save();
        return res.status(200).json({success: true, message: "Task deleted successfully"});
    } catch (error) {
        return showCatchError(error, res);
    }
}

// check/un-check task
const changeStatus = async (req, res) => {
    console.log("IN change status");
    
    try {
        const {task_id} = req.params;
        
        const {status} = req.body;
        console.log(req.body);
        
        console.log(status);
        
        const user = await fetchUser(req);
        console.log("params",task_id);
        
        user.tasks.forEach((task) => {
            const taskIdStr = task._id.toString().trim();
            const paramIdStr = task_id.trim();
            console.log("Task ID:", taskIdStr, "| Length:", taskIdStr.length);
            console.log("Param ID:", paramIdStr, "| Length:", paramIdStr.length);
            if (taskIdStr === paramIdStr) console.log("✅ MATCHED");
            else console.log("❌ NO MATCH");
            console.log('______________');
            
        });
        const task = user.tasks.find((task) => task._id.toString().trim() === task_id.trim());
        console.log("Before status change",task);
        
        if(!task){
            return res.status(404).json({success: false, error: "Task not found"});
        }
        task.status = status;
        console.log("After status change",task);
        await user.save();
        return res.status(200).json({success: true, message: "Task status updated successfully", task});
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = {fetchTasks, addTask, updateTaskDetails, deleteTask, changeStatus, fetchSpecificTask}