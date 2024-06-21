document.querySelector(".new-comment-form").addEventListener('submit', (event)=>{
    event.preventDefault()

    const post_id = window.location.href.split("/")[4];
    const comment_text = document.querySelector("#comment-content").value

    fetch('/api/comments', {
        method: "POST",
        body: JSON.stringify({
            comment_text: comment_text,
            post_id: post_id
        }),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => {
        if(res.status == 200) {
            console.log("Comment has been added!")
            window.location.reload();
        } else {
            console.log("An error has occured")
        }
    })
});