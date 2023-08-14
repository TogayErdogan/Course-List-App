class Course {
    constructor (title,instructor,image){
        this.courseId = Math.floor(Math.random()*10000);
        this.title = title;
        this.instructor = instructor;
        this.image = image;
    }
}

class UI {

    addToCourseList(course){
        const list = document.getElementById("course-list")

        var html = `
            <tr>
                <td><img src="img/${course.image}"/></td>
                <td>${course.title}</td>
                <td>${course.instructor}</td>
                <td><a href="#" data-id = "${course.courseId}" class="btn btn-danger btn-sm delete">Delete</a></td>
            </tr>
        `;
    
        list.innerHTML += html;
    }

    clearControl(){
        const title = document.getElementById('title').value="";
        const instructor = document.getElementById('instructor').value="";
        const image = document.getElementById('image').value="";
    }

    deleteCourse(element){
        if(element.classList.contains("delete")){
            element.parentElement.parentElement.remove();
        }
    }

    showAlert(message, className){
        var alert = `
        <div class="alert alert-${className}">
            ${message}
        </div>
`;

    const row = document.querySelector(".row");
    row.insertAdjacentHTML('beforeBegin',alert);

    setTimeout(() => {
        document.querySelector('.alert').remove();
    }, 3000)
    }
}

class Storage{

    static getCourses(){
        let courses;

        if(localStorage.getItem('courses') === null){
            courses=[];
        }else{
            courses = JSON.parse(localStorage.getItem('courses'));
            console.log(courses)
        }
        

        return courses;
    }

    static displayCourses(){
        const courses = Storage.getCourses();


        courses.forEach(course => {
            const ui = new UI();
            ui.addToCourseList(course);
        });
    }

    static addCourse(course){
        const courses = Storage.getCourses();
        courses.push(course);
        localStorage.setItem ('courses',JSON.stringify(courses));
    }

    static deleteCourse(element){
        if(element.classList.contains("delete")){
            const id = element.getAttribute('data-id');

            const courses = Storage.getCourses();


            courses.forEach((course,index) => {
                if(course.courseId == id){
                    courses.splice(index,1)
                }
            });

            localStorage.setItem('courses', JSON.stringify(courses));
        };
    };


}


document.addEventListener('DOMContentLoaded', Storage.displayCourses);

document.getElementById("new-course").addEventListener('submit', function(e) { 


    const title = document.getElementById('title').value;
    const instructor = document.getElementById('instructor').value;
    const image = document.getElementById('image').value;


    const course = new Course (title,instructor,image);

    const ui = new UI();

    if(title === "" || instructor === "" || image === ""){
        ui.showAlert('Please complete the form','warning');
    }else {
        ui.addToCourseList(course);
        ui.clearControl();
        ui.showAlert('Course added...', 'success')

        // SAVE to LS
        Storage.addCourse(course);
    }

    

    e.preventDefault();
})  

document.getElementById("course-list").addEventListener('click', function(e) {
    const ui = new UI();
    ui.deleteCourse(e.target);

    // DELETE from LS
    Storage.deleteCourse(e.target);

    ui.showAlert('Course deleted...', 'danger')
})