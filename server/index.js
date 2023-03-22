const express = require('express')
const app = express()
const mongoose = require('mongoose')
app.use(require('cors')())
app.use(express.json())
//page of webserver：
app.get('/',async(req,res) =>{
    res.send('hello node')
})

//studentlist：
app.get('/api/getStudentList',async(req,res)=>{
    const students = await Student.find()
    res.send(students)
})
//add student：
app.post('/api/students',async(req,res)=>{
    const student = await Student.create(req.body)
    //return：
    res.send(student)
})
//delete：
app.delete('/api/students/:id',async(req,res)=>{
    await Student.findByIdAndDelete(req.params.id)
    //返回：
    res.send({
        status:true
    })
})
//returen detailed info：
app.get('/api/update/:id',async(req,res)=>{
    const student = await Student.findById(req.params.id)
    res.send(student)
})
//update：
app.put('/api/confirmUpdate/:id',async(req,res)=>{
    const student = await Student.findByIdAndUpdate(req.params.id,req.body)
    res.send(student)
})
//accuate search：
app.get('/api/findBySnumber/:xuehao',async(req,res)=>{
    
    const students = await Student.find({'snumber':req.params.xuehao})
    res.send(students)
})
//fuzzy search：
app.get('/api/findByName/:names',async(req,res)=>{
    var query = new RegExp(req.params.names)
    const students = await Student.find({$or:[{"name": query}]})
    res.send(students)

})
//show in searching pages:
app.get('/api/findByName', (req,res)=>{

    result= {
        data:{},
        total:''
    };
    // var total;
    var confident = new RegExp(req.query.names)

    //total score：
    var query =  Student.find({$or:[{"name": confident}]});
    query.count({},function(err, count){
        if(err){
            res.json(err)
        }else{
            result.total = count;
            console.log("count的值是：",result.total);
        }
    });
    //page：
    pageSize = parseInt(req.query.pageSize);
    currentPage = parseInt(req.query.currentPage);

    Student.find({},(error,data)=>{
            result.data = data;
            res.send(result);
    }).where({$or:[{"name": confident}]}).skip((currentPage-1)*pageSize).limit(pageSize);//对结果默认排序

})
//select search：
app.all('/api/studentList',(req,res,next)=>{

    result= {
        data:[],
        total:''
    };
    // var total;
    //in total：
    var query =  Student.find({});
    query.count({},function(err, count){
        if(err){
            res.json(err)
        }else{
            result.total = count;
            console.log("count：",result);
        }
    });
    //page no：
    pageSize = parseInt(req.query.pageSize);
    currentPage = parseInt(req.query.currentPage);
    console.log("page：");
    console.log(pageSize+"   "+currentPage);
     Student.find({},(error,data)=>{
         result.data = data;
         res.send(result);
    }).skip((currentPage-1)*pageSize).limit(pageSize);//对结果默认排序

});


//DB：
mongoose.connect('mongodb://localhost:27017/studentm',{
    useNewUrlParser:true,
    useFindAndModify:true,
    useCreateIndex:true,
})
const Student = mongoose.model('Student',new mongoose.Schema({
    snumber:{type:String},
    class:{type:String},
    name:{type:String},
    sex:{type:String},
    clan:{type:String},
    javalan:{type:String},
    dblan:{type:String},
}))



app.listen(3001,()=>{
    console.log('http://localhost:3001/')
})