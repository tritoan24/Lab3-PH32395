const express = require('express');
const port = 3000;
const app = express();

const mongoose = require('mongoose');
const uri = 'mongodb+srv://TriToan:bcuJtxHeJc5FXJtR@atlascluster.felyrjm.mongodb.net/QLSV';

const svModel = require('./studentModel');

// Middleware để phân tích dữ liệu gửi lên dưới dạng JSON
app.use(express.json());

app.get('/', async (req, res) => {
    await mongoose.connect(uri);

    let sinhviens = await svModel.find();

    // Viết mã HTML trực tiếp trong hàm res.send()
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Danh sách sinh viên</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
    <div class="container">
        <h1 class="mt-5">Danh sách sinh viên</h1>
        <div class="row mt-3 mb-3">
            <div class="col">
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addStudentModal">
                    Thêm sinh viên
                </button>
            </div>
        </div>
        <!-- Bảng danh sách sinh viên -->
        <table class="table">
            <thead>
                <tr>
                    <th>Tên</th>
                    <th>MSV</th>
                    <th>Tuổi</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                ${sinhviens.map(student => `
                    <tr>
                        <td>${student.name}</td>
                        <td>${student.msv}</td>
                        <td>${student.age}</td>
                        <td>${student.status ? 'Đã Ra Trường' : 'Chưa Ra Trường'}</td>
                        <td>
                            <button type="button" class="btn btn-info btn-sm" onclick="editStudent('${student._id}')">Sửa</button>
                            <button type="button" class="btn btn-danger btn-sm" onclick="deleteStudent('${student._id}')">Xóa</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
    </div>

    <!-- Modal Thêm Sinh Viên -->
    <div class="modal fade" id="addStudentModal" tabindex="-1" aria-labelledby="addStudentModalLabel" aria-hidden="true" onsubmit="handleSubmit(event)">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addStudentModalLabel">Thêm sinh viên</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                <!-- Form thêm sinh viên -->
                <form id="addStudentForm">
                    <div class="mb-3">
                        <label for="name" class="form-label">Tên</label>
                        <input type="text" class="form-control" id="name" name="name" required>
                    </div>
                    <div class="mb-3">
                        <label for="msv" class="form-label">MSV</label>
                        <input type="text" class="form-control" id="msv" name="msv" required>
                    </div>
                    <div class="mb-3">
                        <label for="age" class="form-label">Tuổi</label>
                        <input type="number" class="form-control" id="age" name="age" required>
                    </div>
                    <div class="mb-3">
                        <label for="status" class="form-label">Trạng thái</label>
                        <input type="checkbox" class="form-check-input" id="status" name="status">
                    </div>
                
                    <button type="submit" class="btn btn-primary">Thêm</button>
                </form>
                
                </div>
            </div>
        </div>
    </div>




    <!-- Modal Chỉnh Sửa Sinh Viên -->
<div class="modal fade" id="editStudentModal" tabindex="-1" aria-labelledby="editStudentModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editStudentModalLabel">Chỉnh sửa sinh viên</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
            <form id="editStudentForm">
            <input type="hidden" id="editStudentId">
            <div class="mb-3">
                <label for="editName" class="form-label">Tên</label>
                <input type="text" class="form-control" id="editName" name="editName" required>
            </div>
            <div class="mb-3">
                <label for="editMsv" class="form-label">MSV</label>
                <input type="text" class="form-control" id="editMsv" name="editMsv" required>
            </div>
            <div class="mb-3">
                <label for="editAge" class="form-label">Tuổi</label>
                <input type="number" class="form-control" id="editAge" name="editAge" required>
            </div>
            <div class="mb-3">
                <label for="editStatus" class="form-label">Trạng thái</label>
                <input type="checkbox" class="form-check-input" id="editStatus" name="editStatus">
            </div>
         
            <button type="button" class="btn btn-primary" onclick="updateStudent()">Cập nhật</button>
        </form>
            </div>
        </div>
    </div>
</div>





    <script>
    async function handleSubmit(event) {
        event.preventDefault();
    
        const name = document.getElementById('name').value;
        const msv = document.getElementById('msv').value;
        const age = document.getElementById('age').value;
        const status = document.getElementById('status').checked; // Kiểm tra trạng thái được chọn hay không
        
        // Kiểm tra trường tên không được để trống
        if (!name.trim()) {
            alert('Vui lòng nhập tên của sinh viên.');
            return;
        }
    
        // Kiểm tra trường MSV không được để trống
        if (!msv.trim()) {
            alert('Vui lòng nhập MSV của sinh viên.');
            return;
        }
    
        // Kiểm tra trường tuổi là một số dương
        if (isNaN(age) || age <= 0) {
            alert('Tuổi phải là một số dương.');
            return;
        }
    
        try {
            const response = await fetch('/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, msv, age, status })
            });
    
            if (response.ok) {
                alert('Thêm sinh viên thành công!');
                window.location.reload(); // Tải lại trang sau khi thêm sinh viên thành công
            } else {
                alert('Thêm sinh viên không thành công!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Đã xảy ra lỗi khi thêm sinh viên!');
        }
    }
    


    // function xóa sinh viên
    async function deleteStudent(studentId) {
        try {

        const response = await fetch('/students/' + studentId, {
            method: 'DELETE'
        });
    
            if (response.ok) {
                alert('Xóa sinh viên thành công!');
                window.location.reload(); // Tải lại trang sau khi xóa sinh viên thành công
            } else {
                alert('Xóa sinh viên không thành công!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Đã xảy ra lỗi khi xóa sinh viên!');
        }
    }



    // Function sửa sinh viên
    async function editStudent(studentId) {
        try {
            const response = await fetch('/students/' + studentId);
            const student = await response.json();
    
            // Hiển thị thông tin sinh viên trong modal sửa sinh viên
            document.getElementById('editName').value = student.name;
            document.getElementById('editMsv').value = student.msv;
            document.getElementById('editAge').value = student.age;
            document.getElementById('editStatus').checked = student.status;
    
            document.getElementById('editStudentId').value = student._id;
    
            var myModal = new bootstrap.Modal(document.getElementById('editStudentModal'));
            myModal.show();
        } catch (error) {
            console.error('Error:', error);
            alert('Đã xảy ra lỗi khi tải thông tin sinh viên!');
        }
    }
    
    // Function cập nhật sinh viên
    async function updateStudent() {
        // Lấy thông tin từ form chỉnh sửa
        const name = document.getElementById('editName').value;
        const msv = document.getElementById('editMsv').value;
        const age = document.getElementById('editAge').value;
        const status = document.getElementById('editStatus').checked;
        const studentId = document.getElementById('editStudentId').value;
        // Kiểm tra trường tên không được để trống
        if (!name.trim()) {
            alert('Vui lòng nhập tên của sinh viên.');
            return;
        }
    
        // Kiểm tra trường MSV không được để trống
        if (!msv.trim()) {
            alert('Vui lòng nhập MSV của sinh viên.');
            return;
        }
    
        // Kiểm tra trường tuổi là một số dương
        if (isNaN(age) || age <= 0) {
            alert('Tuổi phải là một số dương.');
            return;
        }
    
        // Gửi yêu cầu PUT để cập nhật thông tin sinh viên
        try {
            const response = await fetch('/students/' + studentId,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, msv, age, status })
            });
    
            if (response.ok) {
                alert('Cập nhật sinh viên thành công!');
                window.location.reload(); // Tải lại trang sau khi cập nhật sinh viên thành công
            } else {
                alert('Cập nhật sinh viên không thành công!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Đã xảy ra lỗi khi cập nhật sinh viên!');
        }
    }
    
    
    
    
</script>

</body>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script> 
    </html>
    `);
});

app.post('/students', async (req, res) => {
    try {
        const { name, msv, age, status } = req.body;
        if (!name || !msv || !age) {
            throw new Error('Missing required fields');
        }
        const newStudent = new svModel({ name, msv, age, status });
        await newStudent.save();
        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});


// Route để xóa sinh viên
app.delete('/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const student = await svModel.findByIdAndDelete(id);
        if (!student) {
            return res.status(404).send('Student not found');
        }
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});
// Route để lấy thông tin của một sinh viên dựa trên ID
app.get('/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const student = await svModel.findById(id);
        if (!student) {
            return res.status(404).send('Student not found');
        }
        res.json(student); // Trả về thông tin sinh viên dưới dạng JSON
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});
// Route để cập nhật thông tin của sinh viên
app.put('/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, msv, age, status } = req.body;
        
        // Kiểm tra xem có thiếu thông tin không
        if (!name || !msv || !age) {
            throw new Error('Missing required fields');
        }
        
        // Tìm và cập nhật thông tin của sinh viên trong database
        const updatedStudent = await svModel.findByIdAndUpdate(id, { name, msv, age, status }, { new: true });
        
        if (!updatedStudent) {
            return res.status(404).send('Student not found');
        }
        
        res.sendStatus(200); // Trả về mã trạng thái thành công
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});







app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
