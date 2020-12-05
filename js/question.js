
//STARTING POINT //

//Array of Objects
const quiz = [
{
    q:'In a relational model , cardinality is termed as ?',
    options:['A number of tuples', 'A number of attributes', 'A number of tables','A number of constraints'],
    answer:0
},
{
    q:'A relational database consists of a collection of ?',
    options:['Tables', 'Fields', 'Records','Keys'],
    answer:0
},
{
    q:'Database __________ which is the logical design of the database, and the database _______ which is a snapshot of the data in the database at a given instant in time.',
    options:['Instance, Schema', 'Relation, Schema', 'Relation, Domain','Schema, Instance'],
    answer:3
},
{
    q:'A domain is atomic if elements of the domain are considered to be ____________ units.',
    options:['Different', 'Indivisbile', 'Constant','Divisible'],
    answer:1
},
{
    q:'Which one of the following is a set of one or more attributes taken collectively to uniquely identify a record?',
    options:['Candidate key', 'Sub key', 'Super key','Foreign key'],
    answer:2
},
{
    q:'The subset of a super key is a candidate key under what condition?',
    options:['No proper subset is a super key',
        'All subsets are super keys',
        'Subset is a super key',
        'Each subset is a super key'],
    answer:0
},
{
    q:'The relation with the attribute which is the primary key is referenced in another relation. The relation which has the attribute as a primary key is called',
    options:['Referential relation',
    'Referencing relation',
    'Referenced relation',
    'Referred relation'],
    answer:1
},
{
    q:'Which of the following statements contains an error?',
    options:['Select * from emp where empid = 10003;',
    'Select empid from emp where empid = 10006;',
    'Select empid from emp;',
    'Select empid where empid = 1009 and lastname = ‘GELLER’;'],
    answer:3
},
{
    q:'How can you find rows that do not match some specified condition?',
    options:['EXISTS',
    'Double use of NOT EXISTS',
    'NOT EXISTS',
    'None of the mentioned'],
    answer:1
},
{
    q:'Using which language can a user request information from a database?',
    options:['Query',
    'Relational',
    'Structural',
    'Compiler'],
    answer:0
}
]