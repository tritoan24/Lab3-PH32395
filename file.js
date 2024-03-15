
// function thêm sinh viên
async function handleSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const msv = document.getElementById('msv').value;
    const age = document.getElementById('age').value;
    
    try {
        const response = await fetch('/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, msv, age })
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

// function sửa sinh viên
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



// function sửa sinh viên
async function editStudent(studentId) {
try {
    const response = await fetch('/students/' + studentId);
    const student = await response.json();

    document.getElementById('editName').value = student.name;
    document.getElementById('editMsv').value = student.msv;
    document.getElementById('editAge').value = student.age;
    document.getElementById('editStudentId').value = student._id;

    var myModal = new bootstrap.Modal(document.getElementById('editStudentModal'));
    myModal.show();
} catch (error) {
    console.error('Error:', error);
    alert('Đã xảy ra lỗi khi tải thông tin sinh viên!');
}
}



async function updateStudent() {
    // Lấy thông tin từ form chỉnh sửa
    const name = document.getElementById('editName').value;
    const msv = document.getElementById('editMsv').value;
    const age = document.getElementById('editAge').value;
    const studentId = document.getElementById('editStudentId').value;

    // Gửi yêu cầu PUT để cập nhật thông tin sinh viên
    try {
        const response = await fetch('/students/' + studentId,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, msv, age })
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



