-- ==============================================================================
-- VSPS School App - Supabase PostgreSQL Database Schema
-- Run this script in your Supabase Project SQL Editor to create all required
-- tables, relationships, indexes, Row Level Security (RLS) policies & seed data.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT DEFAULT '',
    class_section TEXT DEFAULT 'Class VIII A',
    roll_no TEXT DEFAULT '01',
    password TEXT DEFAULT '',
    role TEXT DEFAULT 'Student',
    onboarding_code TEXT DEFAULT 'VSPS-ONBOARD-2026',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TEACHERS TABLE
CREATE TABLE IF NOT EXISTS public.teachers (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT DEFAULT '',
    subject TEXT NOT NULL,
    department TEXT DEFAULT 'Academics',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT DEFAULT '',
    role TEXT DEFAULT 'Admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ATTENDANCE TABLE (Foreign Key -> students)
CREATE TABLE IF NOT EXISTS public.attendance (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    student_id TEXT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    status TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'Late')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. HOMEWORK TABLE
CREATE TABLE IF NOT EXISTS public.homework (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    subject TEXT NOT NULL,
    task TEXT NOT NULL,
    due_date TEXT NOT NULL,
    class_section TEXT DEFAULT 'Class VIII A',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. FEES TABLE (Foreign Key -> students)
CREATE TABLE IF NOT EXISTS public.fees (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    amount TEXT NOT NULL,
    status TEXT DEFAULT 'Unpaid',
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON public.attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_fees_student ON public.fees(student_id);

-- Enable Row Level Security (RLS) and allow public read/write for API key access
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;

-- Permissive RLS Policies for Publishable API Key
CREATE POLICY "Allow public read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public insert students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update students" ON public.students FOR UPDATE USING (true);
CREATE POLICY "Allow public delete students" ON public.students FOR DELETE USING (true);

CREATE POLICY "Allow public read teachers" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Allow public insert teachers" ON public.teachers FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read admins" ON public.admins FOR SELECT USING (true);
CREATE POLICY "Allow public insert admins" ON public.admins FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read attendance" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update attendance" ON public.attendance FOR ALL USING (true);

CREATE POLICY "Allow public read homework" ON public.homework FOR SELECT USING (true);
CREATE POLICY "Allow public insert homework" ON public.homework FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read fees" ON public.fees FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update fees" ON public.fees FOR ALL USING (true);

-- Seed Initial Demo Data
INSERT INTO public.students (id, name, email, phone, class_section, roll_no, password, role, onboarding_code)
VALUES
  ('VSPS-2026-0808', 'Aarav Patel', 'aarav@vsps.edu', '+91 98765 43210', 'Class VIII A', '08', 'password123', 'Student', 'VSPS-ONBOARD-2026'),
  ('VSPS-2026-0809', 'Meera Patel', 'meera.p@vsps.edu', '+91 98765 11111', 'Class VIII A', '14', 'password123', 'Student', 'VSPS-ONBOARD-2026'),
  ('VSPS-2026-0810', 'Rohan Singh', 'rohan@vsps.edu', '+91 98765 22222', 'Class VIII A', '22', 'password123', 'Student', 'VSPS-ONBOARD-2026')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.teachers (name, email, phone, subject, department)
VALUES
  ('Meera Sharma', 'meera.sharma@vsps.edu', '+91 98765 11101', 'Science', 'Academics'),
  ('Rakesh Verma', 'transport@vsps.edu', '+91 98765 11102', 'Physical Ed', 'Transport')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.admins (name, email, phone, role)
VALUES
  ('Admin Anand', 'anandnimcet2020@gmail.com', '+91 9993209760', 'Admin'),
  ('Admin Rahul', 'rrptdr@gmail.com', '+91 9174194656', 'Admin')
ON CONFLICT (email) DO NOTHING;
