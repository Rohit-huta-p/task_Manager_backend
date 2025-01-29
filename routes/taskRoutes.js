const { fetchTasks, addTask, updateTaskDetails, deleteTask, changeStatus, fetchSpecificTask } = require('../controllers/tasksController');
const { verifyToken } = require('../utils/verifyToken');
const router = require('express').Router();

/**
 * Tasks Router
 * *Fetch all tasks
 * GET /
 * _
 * *Add task
 * POST /add {userID}
 * _
 * *Update Task details
 * Patch /update/:task_id {userId}
 * _
 * *DELETE Task
 * Delete /delete/:task_id {userId}
 * _
 * * Mark complete / incomplete
 * PATCH /check/:task_id {userId}
 */

router.get('/', verifyToken, fetchTasks)
router.get('/fetch_task_details/:task_id', verifyToken, fetchSpecificTask)
router.post('/add',verifyToken,  addTask)
router.patch('/update/:task_id',verifyToken,  updateTaskDetails)
router.delete('/delete/:task_id', verifyToken, deleteTask)
router.patch('/statuschange/:task_id', verifyToken, changeStatus)

module.exports = router