  
  const Header = ({name}) => {
    return (
      <h1>{name}</h1>
      )
    }
    
    const Part = ({part}) => {
      return (
        <p>
        {part.name} {part.exercises}
        </p>
        )
      }

      const Course = ({course}) => {
        return (
          <>
          <Header name={course.name} />
          <Content course={course} />
          </>
        )
      }
      
      const Content = ({course}) => {
        return (
          <>     
          {course.parts.map((part) => <Part part={part} key={part.id} />)}
          <Total course={course} />
          </>
          )
        }
        
        const Total = ({course}) => {
          const total = course.parts.reduce((sum, part) => {
            return sum + part.exercises
          }, 0)
          return (
            <p>Total number of exercises {total}</p>
            )
          }

          export default Course