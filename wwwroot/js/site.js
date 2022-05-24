$(function () {

    var positionReg2, idReg2;

    btnComplete();

    $("#todoText").on('keypress', function (e) {
        if (e.which == 13) {
            newItem();
        }
    });

    $("#btnCreate").click(function () {
        newItem();
    })

    $("#btnAll").click(function () {
        $("li").addClass("visible");
        $("li").removeClass("invisible");
    })


    $("#btnActive").click(function () {

        $("li.completed").addClass("invisible");
        $("li.completed").removeClass("visible");
        $("li.active").addClass("visible");
        $("li.active").removeClass("invisible")
    })

    $("#btnCompleted").click(function () {
        $("li.completed").addClass("visible");
        $("li.completed").removeClass("invisible");
        $("li.active").addClass("invisible");
        $("li.active").removeClass("visible");
    })

    $("[id^=btnDelete_").click(function () {
        var id = $(this).attr("id").replace("btnDelete_", "");
        if (confirm("are you sure?")) {
            deleteItem(id);
        }
    })

    $("#btnClear").click(function () {
        if (confirm("Are you sure?")) {
            $.ajax({
                type: "delete",
                url: "/todo/clear",
                cache: false,
                async: true,
                success: function (res) {
                    if (res.state) {
                        location.href = "/todo/"
                    }
                }
            })
        }
    })

    var listItems = $("ul li.draggable");
    $.each(listItems, function (item) {
        DragDropEvent(listItems[item])
    })

    function DragDropEvent(item) {
        item.addEventListener('dragstart', dragStart, false);
        item.addEventListener('dragenter', dragEnter, false);
        item.addEventListener('dragover', dragOver, false);
        item.addEventListener('dragleave', dragLeave, false);
        item.addEventListener('drop', dragDrop, false);
        item.addEventListener('dragend', dragEnd, false);
    }

    function dragStart(e) {
        this.style.opacity = '0.4';
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    };

    function dragEnter(e) {
        this.classList.add('over');

    }

    function dragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    }



    function dragDrop(e) {
        if (dragSrcEl != this) {
            dragSrcEl.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData('text/html');
        }
        btnComplete();
        console.log(e);


        var positionReg1 = $(this).data("position");
        var idReg1 = $(this).data("regid");

        setTimeout(() => {

            $.ajax({
                type: "post",
                async: false,
                data: { positionReg1: positionReg1, idReg1: idReg1, positionReg2: positionReg2, idReg2: idReg2 },
                url: "/todo/newPosition",
                success: function (res) {
                    console.log(res);
                    location.href = "/todo/"
                }


            })
        }, 200);

        return false;
    }

    function dragEnd(e) {
        var listItens = document.querySelectorAll('.draggable');
        [].forEach.call(listItens, function (item) {
            item.classList.remove('over');
        });
        this.style.opacity = '1';

        positionReg2 = $(this).data("position");
        idReg2 = $(this).data("regid");

    }

    function dragLeave(e) {
        e.stopPropagation();
        this.classList.remove('over');
    }

    function newItem() {
        var item = $("#todoText").val()
        if (item == "" || item == null) {
            alert("The input is empty");
        } else {
            data = {
                description: item,
                status: "active"
            }
            $.ajax({
                type: "post",
                url: "/todo/newItem",
                cache: false,
                async: true,
                data: data,
                success: function (res) {
                    if (res.status) {
                        location.href = "/todo/"
                    }
                }
            })
        }


    }

    function completeItem(id, status) {
        $.ajax({
            type: "POST",
            url: "/todo/completeItem",
            cache: false,
            async: true,
            data: {
                id: id,
                status: status
            },
            success: function (res) {
                if (res.state) {
                    location.href = "/todo/"
                }
            }
        })
    }

    function deleteItem(id) {
        $.ajax({
            type: "delete",
            url: "/todo/deleteItem",
            cache: false,
            async: true,
            data: { id: id },
            success: function (res) {
                console.log(res)
                if (res.state) {
                    location.href = "/todo/"
                }
            }
        })
    }

    function btnComplete() {
        $("[id^=check_").click(function () {
            var id = $(this).attr("id").replace("check_", "");
            var status = ""
            $(this).next().toggleClass("completed");

            if ($(this).next().hasClass("completed")) {
                status = "completed";
                completeItem(id, status);
            } else {
                status = "active";
                completeItem(id, status);
            }

        })
    }

})