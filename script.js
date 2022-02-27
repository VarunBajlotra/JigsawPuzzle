var timerFunction;

var loadFile = (event) => {
	var imageUrl = URL.createObjectURL(event.target.files[0]);
    var images = [
        { src: imageUrl}
    ];
    amigoJigsawPuzzle.startGame(images);
};

var amigoJigsawPuzzle = {
    startGame: function (images) {
        this.images = images;
        helper.doc('welcome').style.display = 'none';
        helper.doc('level1').style.display = 'block';
    },
    level1: function(){
        let x1 = helper.doc('x1').value;
        let y1 = helper.doc('y1').value;
        console.log(x1, y1);
        this.setImage(this.images, 1, x1, y1);
        helper.doc('level1').style.display = 'none';
        helper.doc('playPanel').style.display = 'block';
    },
    level2: function(){
        let x2 = helper.doc('x2').value;
        let y2 = helper.doc('y2').value;
        console.log(x2, y2);
        this.setImage(this.images, 2, x2, y2);
        helper.doc('level2').style.display = 'none';
        helper.doc('playPanel').style.display = 'block';
    },
    level3: function(){
        let x3 = helper.doc('x3').value;
        let y3 = helper.doc('y3').value;
        console.log(x3, y3);
        this.setImage(this.images, 3, x3, y3);
        helper.doc('level3').style.display = 'none';
        helper.doc('playPanel').style.display = 'block';
    },
    setImage: (images, level, gridSizeX = 4, gridSizeY = 4) => {
        var percentageX = gridSizeX == 1 ? 100 : 100 / (gridSizeX - 1);
        var percentageY = gridSizeY == 1 ? 100 : 100/ (gridSizeY - 1);
        var image = images[0];
        helper.doc('actualImage').setAttribute('src', image.src);
        helper.doc('sortable').innerHTML = '';
        for (var i = 0; i < gridSizeX * gridSizeY; i++) {
            var xpos = (percentageX * (i % gridSizeX)) + '%';
            var ypos = (percentageY * Math.floor(i / gridSizeX)) + '%';
            let li = document.createElement('li');
            li.id = i;
            li.setAttribute('data-value', i);
            li.style.backgroundImage = 'url(' + image.src + ')';
            li.style.backgroundSize = (gridSizeX * 100) + '% ' + (gridSizeY * 100) + '%';
            li.style.backgroundPosition = xpos + ' ' + ypos;
            var uploadedImage = new Image();
            uploadedImage.src = image.src;
            var ht, wd;
            uploadedImage.onload = function() {
                ht = uploadedImage.height;
                wd = uploadedImage.width;
            }
            setTimeout(() => { 
                var ratio = wd / 400;
                ht = ht / ratio;
                wd = 400;
                li.style.width = wd / gridSizeX + 'px';
                li.style.height = ht / gridSizeY + 'px';
            }, 300);

            li.setAttribute('draggable', 'true');
            li.ondragstart = (event) => event.dataTransfer.setData('data', event.target.id);
            li.ondragover = (event) => event.preventDefault();
            li.ondrop = (event) => {
                let origin = helper.doc(event.dataTransfer.getData('data'));
                let dest = helper.doc(event.target.id);
                let p = dest.parentNode;

                if (origin && dest && p) {
                    let temp = dest.nextSibling;
                    let x_diff = origin.offsetLeft-dest.offsetLeft;
                    let y_diff = origin.offsetTop-dest.offsetTop;

                    if(y_diff == 0 && x_diff >0){
                        //LEFT SWAP
                        p.insertBefore(origin, dest);
                        p.insertBefore(temp, origin);
                    }
                    else{
                        p.insertBefore(dest, origin);
                        p.insertBefore(origin, temp);
                    }

                    let vals = Array.from(helper.doc('sortable').children).map(x => x.id);

                    if (isSorted(vals)) {
                        switch(level){
                            case 1:helper.doc('level2').style.display = 'block';
                                   helper.doc('level2').scrollIntoView({behavior: 'smooth'});
                                   break;
                            case 2:helper.doc('level3').style.display = 'block';
                                   helper.doc('level3').scrollIntoView({behavior: 'smooth'});
                                   break;
                            case 3:helper.doc('gameOver').style.display = 'block';
                                   helper.doc('gameOver').scrollIntoView({behavior: 'smooth'});
                                   break;
                        }
                    }
                }
            };
            li.setAttribute('dragstart', 'true');
            helper.doc('sortable').appendChild(li);
        }
        do{
            helper.shuffle('sortable');
            var valArr = Array.from(helper.doc('sortable').children).map(x => x.id);
        }while(isSorted(valArr));
    }
};

isSorted = (arr) => arr.every((elem, index) => { return elem == index; });

var helper = {
    doc: (id) => document.getElementById(id) || document.createElement("div"),

    shuffle: (id) => {
        var ul = document.getElementById(id);
        for (var i = ul.children.length; i >= 0; i--) {
            ul.appendChild(ul.children[Math.random() * i | 0]);
        }
    }
}