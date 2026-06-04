import React from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Code, Sparkles, Plus } from "lucide-react";
import SkillItem from "./SkillItem";

type Props = {
  skills: any[];
  onEdit: (skill: any) => void;
  onDelete: (id: number) => void;
  onAddFirst: () => void;
};

const SkillList: React.FC<Props> = ({ skills, onEdit, onDelete, onAddFirst }) => {
  const tecnicas = skills.filter((s) => s.type === "tecnica");
  const blandas = skills.filter((s) => s.type === "blanda");

  const Section = ({ title, icon: Icon, data, typeLabel, iconBgClass, iconTextClass }: any) => (
    <Card className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${iconBgClass}`}>
          <Icon className={`w-6 h-6 ${iconTextClass}`} />
        </div>
        <h2 className="text-xl font-bold  m-0">{title}</h2>
      </div>

      {data.length > 0 ? (
        <div className="space-y-4">
          {data.map((skill: any) => (
            <SkillItem key={skill.id} skill={skill} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 opacity-30" />
          </div>
          <p className="opacity-60 mb-4">No tienes habilidades {typeLabel} registradas</p>
          <Button variant="outline" size="sm" className="gap-2 mx-auto inline-flex" onClick={onAddFirst}>
            <Plus className="w-4 h-4" />
            Agregar Primera Habilidad
          </Button>
        </div>
      )}
    </Card>
  );

  return (
    <>
      <Section 
        title="Habilidades Técnicas" 
        icon={Code} 
        iconBgClass="bg-primary/10" 
        iconTextClass="text-primary" 
        data={tecnicas} 
        typeLabel="técnicas" 
      />
      <Section 
        title="Habilidades Blandas" 
        icon={Sparkles} 
        iconBgClass="bg-accent/10" 
        iconTextClass="text-accent" 
        data={blandas} 
        typeLabel="blandas" 
      />
    </>
  );
};

export default SkillList;
