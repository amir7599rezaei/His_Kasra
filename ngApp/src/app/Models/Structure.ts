export class Structure{
    ShiftAssignmentID: number;
    RequestStructureID: number;
    RequestStructureStatus: number;

    StructureID: number;// this.structur[m].id,
    StructureTitle: string;// this.structur[m].title,
    StructureAcronym: string;// this.structur[m].title,

    CategoryStructureID: number;// this.structur[m].categoryid,
    CategoryStructureTitle: string;//this.structur[m].categorytitle,
    CategoryStructureAcronym: string;// this.structur[m].categorytitle,

    FinalStructureID: number;//
    FinalStructureTitle: string;//
    FinalStructureAcronym: string;// ,

    OtherDepartmentStructure:boolean;

    Karkard: number;
    DayStyle: string;

    enable: boolean = false;
}
