<template>
    <div class="canvasBox">
        <canvas id="canvas"></canvas>
    </div>
</template>

<script>
export default {
    name:'validCode',
    data(){
        return{
            showCode:[]   //存放随机字符
        };
    },


    methods:{
        drawCode() {
                    var _this = this;
                    var showCode = this.showCode;   
                    _this.draw(showCode);
                    $("#canvas").on('click',function(){
                    _this.draw(showCode);
                })
        },

        // 验证码
        draw(showCode) {
              var canvas = document.getElementById("canvas"),
                  context = canvas.getContext("2d");
                  canvas.width = 90;
                  canvas.height = 40;
              var canvas_width = canvas.width,
                  canvas_height = canvas.height,
                  allCode = "A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0",
                  newCode = allCode.split(","),
                  aLength = newCode.length;
              
              for (var i = 0; i <= 3; i++) {
                  var j = Math.floor(Math.random() * aLength);      // 获取到随机的索引值
                  var deg = Math.random() * 30 * Math.PI / 180;    // 产生0~30之间的随机弧度
                  var txt = newCode[j];                           // 得到随机的一个内容
                  showCode[i] = txt.toLowerCase();
                  var x = 10 + i * 20;                           // 文字在canvas上的x坐标
                  var y = 15 + Math.random() * 8;               // 文字在canvas上的y坐标
                  context.font = "bold 20px 微软雅黑";
  
                  context.translate(x, y);
                  context.rotate(deg);
  
                  context.fillStyle = this.randomColor();
                  context.fillText(txt, 0, 0);
  
                  context.rotate(-deg);
                  context.translate(-x, -y);
              }

              // 验证码上显示线条
              for (var i = 0; i <= 5; i++) { 
                  context.strokeStyle = this.randomColor();
                  context.beginPath();
                  context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
                  context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
                  context.stroke();
              }

              // 验证码上显示小点
              for (var i = 0; i <= 20; i++) { 
                  context.strokeStyle = this.randomColor();
                  context.beginPath();
                  var x = Math.random() * canvas_width;
                  var y = Math.random() * canvas_height;
                  context.moveTo(x, y);
                  context.lineTo(x + 1, y + 1);
                  context.stroke();
              }
        },

        randomColor() {
            var r = Math.floor(Math.random() * 256);
            var g = Math.floor(Math.random() * 256);
            var b = Math.floor(Math.random() * 256);
            return "rgb(" + r + "," + g + "," + b + ")";
        },
    }
}
</script>

<style  scoped>
#canvas {
    display: block;
    cursor: pointer;
}

.canvasBox{
    width: 100px;
    height: 40px;
    background-color: #f1f1f1;
    border-radius:5px;
}
</style>