import React from "react"

interface TodoItemProps {
  done: boolean,
  text: string,
}

class TodoItem extends React.Component<TodoItemProps, {}> {

  componentWillMount() {
    alert('this')
  }

  render() {
    return (
      <div>

      </div>
    )
  }
}

export default TodoItem;