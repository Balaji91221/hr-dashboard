import type { Employee } from "./store"

const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "Design",
  "Product",
  "Legal",
  "Support",
]

const projects = [
  "Website Redesign",
  "Mobile App Development",
  "Data Migration",
  "Security Audit",
  "Performance Optimization",
  "User Research",
  "Brand Guidelines",
  "API Integration",
  "Database Optimization",
  "Customer Portal",
  "Analytics Dashboard",
  "Payment System",
]

const feedbackAuthors = [
  "Sarah Johnson",
  "Mike Chen",
  "Emily Davis",
  "David Wilson",
  "Lisa Anderson",
  "Tom Brown",
  "Anna Garcia",
  "Chris Lee",
]

function generateRandomRating(): number {
  return Math.floor(Math.random() * 5) + 1
}

function generateRandomProjects(): string[] {
  const shuffled = [...projects].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.floor(Math.random() * 4) + 1)
}

function generateRandomFeedback(): Employee["feedback"] {
  const feedbackCount = Math.floor(Math.random() * 5) + 1
  return Array.from({ length: feedbackCount }, (_, index) => ({
    id: `feedback-${index}`,
    author: feedbackAuthors[Math.floor(Math.random() * feedbackAuthors.length)],
    comment: [
      "Excellent work on the recent project. Shows great attention to detail.",
      "Strong communication skills and team collaboration.",
      "Consistently meets deadlines and delivers quality work.",
      "Shows initiative and takes ownership of tasks.",
      "Great problem-solving abilities and technical skills.",
      "Positive attitude and willingness to help others.",
      "Demonstrates leadership potential and mentoring skills.",
    ][Math.floor(Math.random() * 7)],
    date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    rating: generateRandomRating(),
  }))
}

export async function fetchEmployees(): Promise<Employee[]> {
  try {
    const response = await fetch("https://dummyjson.com/users?limit=20")
    const data = await response.json()
    return data.users.map((user: any) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      phone: user.phone,
      address: user.address,
      company: {
        department: departments[Math.floor(Math.random() * departments.length)],
        name: user.company?.name || "TechCorp Inc.",
        title: user.company?.title || "Employee",
      },
      image: user.image,
      rating: generateRandomRating(),
      projects: generateRandomProjects(),
      feedback: generateRandomFeedback(),
    }))
  } catch (error) {
    console.error("Failed to fetch employees:", error)
    return []
  }
}
